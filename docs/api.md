To implement stock price and options data fetching with Yahoo Finance's free API using the yfinance Python wrapper within a Vite framework, here is a practical approach and relevant documentation:

Overview of Setup
Use yfinance Python library to fetch 15-minute delayed stock and options data from Yahoo Finance.

Build a lightweight backend service in Python (Flask or FastAPI) that exposes REST endpoints for your Vite frontend.

Vite front end makes HTTP requests to your backend API to get ticker, stock price, options prices, and expiry data.

Why this approach?
yfinance has strong support for options data (expiry dates, calls, puts).

Yahoo Finance API is free with 15-minute delay.

Separating backend avoids CORS and security issues of calling Yahoo Finance directly from browser.

Vite easily integrates API calls from local or remote backend.

Key Documentation and Resources
1. yfinance Python Library
GitHub: https://github.com/ranaroussi/yfinance

API Reference: https://ranaroussi.github.io/yfinance/reference/index.html

Usage example to get options expiries & chains:

python
import yfinance as yf

msft = yf.Ticker("MSFT")

# Get option expiration dates
expirations = msft.options

# Get options chain for an expiration
opt_chain = msft.option_chain(expirations[0]) 
calls = opt_chain.calls
puts = opt_chain.puts
2. Building a REST API Backend for Vite Frontend
Use Flask or FastAPI to wrap yfinance calls as RESTful JSON endpoints.

Example with Flask:

python
from flask import Flask, jsonify
import yfinance as yf

app = Flask(__name__)

@app.route('/stock/<ticker>')
def stock_price(ticker):
    stock = yf.Ticker(ticker)
    price = stock.info['regularMarketPrice']
    return jsonify({'price': price})

@app.route('/options/<ticker>')
def options(ticker):
    stock = yf.Ticker(ticker)
    expirations = stock.options
    chain = stock.option_chain(expirations[0])
    return jsonify({
        'expirations': expirations,
        'calls': chain.calls.to_dict(orient='records'),
        'puts': chain.puts.to_dict(orient='records')
    })

if __name__ == "__main__":
    app.run()
3. Calling Backend API from Vite Frontend
Use fetch or Axios in your Vite React/Vue app to query your API.

Example in JavaScript:

js
async function fetchStock(ticker) {
    const res = await fetch(`http://localhost:5000/stock/${ticker}`);
    const data = await res.json();
    console.log(data.price);
}

async function fetchOptions(ticker) {
    const res = await fetch(`http://localhost:5000/options/${ticker}`);
    const data = await res.json();
    console.log(data.expirations, data.calls, data.puts);
}
4. Vite API Integration Docs
Official guide for backend integration: https://vite.dev/guide/backend-integration

Use proxy option in vite.config.js for local development to forward API requests

Example proxy config:

js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
}
Summary
Use yfinance in Python backend (Flask or FastAPI) to get stock and options data.

Expose data via REST API.

Call backend API from Vite frontend.

Use Vite proxy for local dev ease.

This stack supports free 15-minute delayed data with rich options info.

If you want, I can provide a full sample project setup including backend and Vite frontend code next. Let me know!