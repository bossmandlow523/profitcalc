## FormulaIM: Strategy-by-Strategy

All payoffs are per share, at expiration unless otherwise noted. For non-expiration valuation in calendars/diagonals/PMCC, Black–Scholes is used for the remaining long-dated leg.

### Core helpers (used by all)

Python:
```python
import math

def call_payoff_long(S, K, prem):      # long call at expiry
    return max(S - K, 0.0) - prem

def call_payoff_short(S, K, prem):     # short call at expiry
    return prem - max(S - K, 0.0)

def put_payoff_long(S, K, prem):       # long put at expiry
    return max(K - S, 0.0) - prem

def put_payoff_short(S, K, prem):      # short put at expiry
    return prem - max(K - S, 0.0)

# Black–Scholes (European) for calendar/diagonal/PMCC valuation of the long-dated leg
def _phi(x):  # standard normal CDF
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))

def bs_call_price(S, K, r, sigma, T):
    if T <= 0 or sigma <= 0:
        return max(S - K, 0.0)
    d1 = (math.log(S/K) + (r + 0.5*sigma*sigma)*T) / (sigma*math.sqrt(T))
    d2 = d1 - sigma*math.sqrt(T)
    return S*_phi(d1) - K*math.exp(-r*T)*_phi(d2)

def bs_put_price(S, K, r, sigma, T):
    if T <= 0 or sigma <= 0:
        return max(K - S, 0.0)
    d1 = (math.log(S/K) + (r + 0.5*sigma*sigma)*T) / (sigma*math.sqrt(T))
    d2 = d1 - sigma*math.sqrt(T)
    return K*math.exp(-r*T)*(1 - _phi(d2)) - S*(1 - _phi(d1))
```

### 1) Long Call

- Payoff: max(S_T − K, 0) − premium
- B/E: K + premium
- Max loss: premium
- Max profit: unbounded

Python:
```python
def long_call_pnl(S, K, premium):
    return call_payoff_long(S, K, premium)
```

### 2) Long Put

- Payoff: max(K − S_T, 0) − premium
- B/E: K − premium
- Max loss: premium
- Max profit: approximately K − premium

Python:
```python
def long_put_pnl(S, K, premium):
    return put_payoff_long(S, K, premium)
```

### 3) Covered Call (long stock @ S0 + short call Kc)

- P/L: (S_T − S0) + [premium_c − max(0, S_T − Kc)]
- B/E stock-side: S0 − premium_c
- Max profit: (Kc − S0) + premium_c
- Max loss: S0 − premium_c (if stock → 0)

Python:
```python
def covered_call_pnl(S, S0, Kc, prem_c):
    stock = S - S0
    short_call = call_payoff_short(S, Kc, prem_c)
    return stock + short_call
```

### 4) Cash-Secured Put (short put K)

- P/L: premium − max(0, K − S_T)
- B/E: K − premium
- Max profit: premium
- Max loss: K − premium (if stock → 0)

Python:
```python
def cash_secured_put_pnl(S, K, premium):
    return put_payoff_short(S, K, premium)
```

### 5) Naked (Short) Call

- P/L: premium − max(0, S_T − K)
- B/E: K + premium
- Max loss: unlimited
- Max profit: premium

Python:
```python
def naked_call_pnl(S, K, premium):
    return call_payoff_short(S, K, premium)
```

### 6) Naked (Short) Put

- P/L: premium − max(0, K − S_T)
- B/E: K − premium
- Max loss: K − premium
- Max profit: premium

Python:
```python
def naked_put_pnl(S, K, premium):
    return put_payoff_short(S, K, premium)
```

### 7) Credit Spreads

#### 7a) Bull Put Credit Spread (short put Kh, long put Kl < Kh)

- P/L: [prem_h − max(0, Kh − S_T)] + [−prem_l + max(0, Kl − S_T)]
- Net credit: C = prem_h − prem_l
- Max profit: C (if S_T ≥ Kh)
- Max loss: (Kh − Kl) − C
- B/E: Kh − C

Python:
```python
def bull_put_spread_pnl(S, Kh, Kl, prem_short, prem_long):
    short_put = put_payoff_short(S, Kh, prem_short)
    long_put  = put_payoff_long(S, Kl, prem_long)
    return short_put + long_put
```

#### 7b) Bear Call Credit Spread (short call Kl, long call Kh > Kl)

- P/L: [prem_l − max(0, S_T − Kl)] + [−prem_h + max(0, S_T − Kh)]
- Net credit: C = prem_l − prem_h
- Max profit: C (if S_T ≤ Kl)
- Max loss: (Kh − Kl) − C
- B/E: Kl + C

Python:
```python
def bear_call_spread_pnl(S, Kl, Kh, prem_short, prem_long):
    short_call = call_payoff_short(S, Kl, prem_short)
    long_call  = call_payoff_long(S, Kh, prem_long)
    return short_call + long_call
```

### 8) Bull Call (Debit) Spread (long Kl, short Kh)

- P/L: [max(S_T − Kl, 0) − prem_l] + [prem_h − max(0, S_T − Kh)]
- Net debit: D = prem_l − prem_h
- Max profit: (Kh − Kl) − D
- Max loss: D
- B/E: Kl + D

Python:
```python
def bull_call_spread_pnl(S, Kl, Kh, prem_long, prem_short):
    long_call  = call_payoff_long(S, Kl, prem_long)
    short_call = call_payoff_short(S, Kh, prem_short)
    return long_call + short_call
```

### 9) Bear Put (Debit) Spread (long Kh, short Kl)

- P/L: [max(Kh − S_T, 0) − prem_h] + [prem_l − max(0, Kl − S_T)]
- Net debit: D = prem_h − prem_l
- Max profit: (Kh − Kl) − D
- Max loss: D
- B/E: Kh − D

Python:
```python
def bear_put_spread_pnl(S, Kh, Kl, prem_long, prem_short):
    long_put  = put_payoff_long(S, Kh, prem_long)
    short_put = put_payoff_short(S, Kl, prem_short)
    return long_put + short_put
```

### 10) Poor Man’s Covered Call (PMCC: diagonal long deep-ITM call, short near-term call)

At near-term expiry t1, short call expires; long call still has T_rem left.

- P/L at t1: −debit + short_prem − ITM_loss_short(S_t1) + value of long call with T_rem

Python:
```python
def pmcc_pnl_at_short_expiry(S, K_long, prem_long, K_short, prem_short, r, sigma, T_remaining):
    # debit = prem_long - prem_short received
    debit = prem_long - prem_short
    short_leg = call_payoff_short(S, K_short, prem_short)            # settles at t1
    long_leg_value = bs_call_price(S, K_long, r, sigma, T_remaining) # still alive
    return -debit + short_leg + long_leg_value
```

### 11) Calendar (same strike; long farther expiry, short near)

At near expiry t1, short dies; you hold the longer option.

- P/L at t1: −net debit + value of remaining long (BS). Use call or put version.

Python:
```python
def calendar_call_pnl_at_near_expiry(S, K, prem_long, prem_short, r, sigma, T_remaining):
    net_debit = prem_long - prem_short
    remaining = bs_call_price(S, K, r, sigma, T_remaining)
    return -net_debit + remaining

def calendar_put_pnl_at_near_expiry(S, K, prem_long, prem_short, r, sigma, T_remaining):
    net_debit = prem_long - prem_short
    remaining = bs_put_price(S, K, r, sigma, T_remaining)
    return -net_debit + remaining
```

### 12) Ratio Backspread

#### 12a) Call Ratio Backspread (sell 1 @ Ks, buy n≥2 @ Kl > Ks)

- P/L: short call + n × long call (often set net credit or small debit)

Python:
```python
def call_ratio_backspread_pnl(S, K_short, prem_short, K_long, prem_long, n_long=2):
    short = call_payoff_short(S, K_short, prem_short)
    longs = n_long * call_payoff_long(S, K_long, prem_long)
    return short + longs
```

#### 12b) Put Ratio Backspread (sell 1 @ Ks, buy n≥2 @ Kl < Ks)

Python:
```python
def put_ratio_backspread_pnl(S, K_short, prem_short, K_long, prem_long, n_long=2):
    short = put_payoff_short(S, K_short, prem_short)
    longs = n_long * put_payoff_long(S, K_long, prem_long)
    return short + longs
```

### 13) Iron Condor (short put Kps, long put Kpl, short call Kcs, long call Kcl)

- P/L: sum of each leg
- Net credit: C
- Max loss: min(put-wing, call-wing) width minus C
- B/E: Kps − C and Kcs + C

Python:
```python
def iron_condor_pnl(S, Kp_long, Kp_short, Kc_short, Kc_long, prem_p_long, prem_p_short, prem_c_short, prem_c_long):
    long_put  = put_payoff_long(S, Kp_long, prem_p_long)
    short_put = put_payoff_short(S, Kp_short, prem_p_short)
    short_call= call_payoff_short(S, Kc_short, prem_c_short)
    long_call = call_payoff_long(S, Kc_long, prem_c_long)
    return long_put + short_put + short_call + long_call
```

### 14) Butterfly (long call butterfly: buy K1, sell 2×K2, buy K3, K1 < K2 < K3)

- P/L at expiry: C(K1) − 2·C(K2) + C(K3) minus net debit

Python:
```python
def long_call_butterfly_pnl(S, K1, K2, K3, prem1, prem2, prem3):
    long1   = call_payoff_long(S, K1, prem1)
    short2x = 2.0 * call_payoff_short(S, K2, prem2)  # selling two calls at K2
    long3   = call_payoff_long(S, K3, prem3)
    return long1 + short2x + long3
```

### 15) Collar (long stock @ S0 + long put Kp + short call Kc)

- P/L: (S_T − S0) + put_long + call_short
- Max loss: (S0 − Kp) + put_prem − call_prem
- Max profit: (Kc − S0) + call_prem − put_prem

Python:
```python
def collar_pnl(S, S0, Kp, prem_put, Kc, prem_call):
    stock = S - S0
    put_leg = put_payoff_long(S, Kp, prem_put)
    call_leg = call_payoff_short(S, Kc, prem_call)
    return stock + put_leg + call_leg
```

### 16) Diagonal (generic long farther expiry, short nearer, different strikes)

At near expiry t1: settle short; value long by BS with T_rem. Use call or put flavor.

Python:
```python
def diagonal_call_pnl_at_near_expiry(S, K_long, prem_long, K_short, prem_short, r, sigma, T_remaining):
    short = call_payoff_short(S, K_short, prem_short)
    remaining = bs_call_price(S, K_long, r, sigma, T_remaining)
    debit = prem_long - prem_short
    return -debit + short + remaining

def diagonal_put_pnl_at_near_expiry(S, K_long, prem_long, K_short, prem_short, r, sigma, T_remaining):
    short = put_payoff_short(S, K_short, prem_short)
    remaining = bs_put_price(S, K_long, r, sigma, T_remaining)
    debit = prem_long - prem_short
    return -debit + short + remaining
```

### 17) Double Diagonal (sell near strangle; buy farther strangle)

At near expiry t1: shorts die; longs remain (valued by BS).

Python:
```python
def double_diagonal_pnl_at_near_expiry(
    S,
    Kp_long, Kp_short, Kc_short, Kc_long,
    prem_p_long, prem_p_short, prem_c_short, prem_c_long,
    r, sigma_put, sigma_call, T_remaining):
    short_put  = put_payoff_short(S, Kp_short, prem_p_short)
    short_call = call_payoff_short(S, Kc_short, prem_c_short)
    long_put_val  = bs_put_price(S, Kp_long, r, sigma_put,  T_remaining)
    long_call_val = bs_call_price(S, Kc_long, r, sigma_call, T_remaining)
    net_debit = (prem_p_long + prem_c_long) - (prem_p_short + prem_c_short)
    return -net_debit + short_put + short_call + long_put_val + long_call_val
```

### 18) Straddle (long call K + long put K)

- P/L: max(S_T − K, 0) − prem_c + max(K − S_T, 0) − prem_p
- Total debit: D = prem_c + prem_p
- B/E: K ± D

Python:
```python
def long_straddle_pnl(S, K, prem_call, prem_put):
    return call_payoff_long(S, K, prem_call) + put_payoff_long(S, K, prem_put)
```

### 19) Strangle (long call Kc + long put Kp, with Kp < Kc)

- Upper B/E: Kc + (prem_c + prem_p)
- Lower B/E: Kp − (prem_c + prem_p)

Python:
```python
def long_strangle_pnl(S, Kc, prem_c, Kp, prem_p):
    return call_payoff_long(S, Kc, prem_c) + put_payoff_long(S, Kp, prem_p)
```

### 20) Covered Strangle (long stock @ S0 + short OTM call Kc + short OTM put Kp)

- P/L: stock + short call + short put
- Max profit: (Kc − S0) + prem_c + prem_p
- Downside risk: heavy (like two short puts synthetically)

Python:
```python
def covered_strangle_pnl(S, S0, Kc, prem_c, Kp, prem_p):
    stock = S - S0
    sc = call_payoff_short(S, Kc, prem_c)
    sp = put_payoff_short(S, Kp, prem_p)
    return stock + sc + sp
```

### 21) Synthetic Long Put (short stock @ S0 + long call K)

- If S0 = K, payoff equals long put K

Python:
```python
def synthetic_long_put_pnl(S, S0_short, K, prem_call):
    short_stock = S0_short - S
    long_call = call_payoff_long(S, K, prem_call)
    return short_stock + long_call
```

### 22) Reverse Conversion / Reversal (short stock + long call K + short put K)

- Arbitrage combo; P/L is fixed if priced off put–call parity

Python:
```python
def reverse_conversion_pnl_at_expiry(S, S0_short, K, prem_call, prem_put):
    short_stock = S0_short - S
    long_call   = call_payoff_long(S, K, prem_call)
    short_put   = put_payoff_short(S, K, prem_put)
    return short_stock + long_call + short_put
```

### 23) Generic N-leg engine (sum of any legs)

Pass tuples like ("call","long",K,prem,qty) or ("put","short",K,prem,qty); include a stock leg as ("stock","long",S0,0,qty) or ("stock","short",S0,0,qty).

Python:
```python
def multi_leg_pnl(S, legs):
    """
    legs: list of tuples (kind, side, K_or_S0, premium, qty)
      kind in {"call","put","stock"}
      side in {"long","short"}
      qty: positive int
    """
    total = 0.0
    for kind, side, K_or_S0, prem, qty in legs:
        sign = 1 if side=="long" else -1
        if kind=="call":
            if side=="long":
                leg = call_payoff_long(S, K_or_S0, prem)
            else:
                leg = call_payoff_short(S, K_or_S0, prem)
        elif kind=="put":
            if side=="long":
                leg = put_payoff_long(S, K_or_S0, prem)
            else:
                leg = put_payoff_short(S, K_or_S0, prem)
        elif kind=="stock":
            # premium ignored; K_or_S0 is entry price
            leg = (S - K_or_S0) if side=="long" else (K_or_S0 - S)
        else:
            raise ValueError("Unknown kind")
        total += qty * leg
    return total
```


