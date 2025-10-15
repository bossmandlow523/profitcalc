"""
Quick test script for the Options Calculator API
Run this to verify all endpoints are working
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def print_response(title, response):
    """Pretty print API response"""
    print(f"\n{'='*60}")
    print(f"TEST: {title}")
    print(f"{'='*60}")
    print(f"Status Code: {response.status_code}")

    if response.status_code == 200:
        try:
            data = response.json()
            print(json.dumps(data, indent=2))
            print("✅ SUCCESS")
        except:
            print(response.text)
    else:
        print(f"❌ FAILED: {response.text}")
    print()

def test_health():
    """Test health check endpoint"""
    response = requests.get(f"{BASE_URL}/api/health")
    print_response("Health Check", response)
    return response.status_code == 200

def test_stock_quote(symbol="AAPL"):
    """Test stock quote endpoint"""
    response = requests.get(f"{BASE_URL}/api/stocks/{symbol}/quote")
    print_response(f"Stock Quote for {symbol}", response)
    return response.status_code == 200

def test_expiry_dates(symbol="AAPL"):
    """Test expiry dates endpoint"""
    response = requests.get(f"{BASE_URL}/api/options/{symbol}/expiries")
    print_response(f"Expiry Dates for {symbol}", response)

    # Return first expiry date for next test
    if response.status_code == 200:
        data = response.json()
        if data.get('data', {}).get('expiryDates'):
            return data['data']['expiryDates'][0]['date']
    return None

def test_options_chain(symbol="AAPL", expiry_date=None):
    """Test options chain endpoint"""
    url = f"{BASE_URL}/api/options/{symbol}/chain"
    if expiry_date:
        url += f"?expiryDate={expiry_date}"

    response = requests.get(url)
    print_response(f"Options Chain for {symbol}" + (f" ({expiry_date})" if expiry_date else ""), response)
    return response.status_code == 200

def test_volatility(symbol="AAPL"):
    """Test volatility endpoint"""
    response = requests.get(f"{BASE_URL}/api/stocks/{symbol}/volatility")
    print_response(f"Volatility for {symbol}", response)
    return response.status_code == 200

def test_symbol_search(query="apple"):
    """Test symbol search endpoint"""
    response = requests.get(f"{BASE_URL}/api/stocks/search?q={query}")
    print_response(f"Symbol Search: '{query}'", response)
    return response.status_code == 200

def test_validate_symbol(symbol="AAPL"):
    """Test symbol validation endpoint"""
    response = requests.get(f"{BASE_URL}/api/stocks/{symbol}/validate")
    print_response(f"Validate Symbol: {symbol}", response)
    return response.status_code == 200

def main():
    """Run all tests"""
    print(f"\n{'#'*60}")
    print("OPTIONS CALCULATOR API TEST SUITE")
    print(f"Testing: {BASE_URL}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'#'*60}\n")

    results = {}
    symbol = "AAPL"

    # Test 1: Health Check
    results['Health Check'] = test_health()

    # Test 2: Stock Quote
    results['Stock Quote'] = test_stock_quote(symbol)

    # Test 3: Expiry Dates (and get first expiry)
    expiry_date = test_expiry_dates(symbol)
    results['Expiry Dates'] = expiry_date is not None

    # Test 4: Options Chain
    if expiry_date:
        results['Options Chain'] = test_options_chain(symbol, expiry_date)
    else:
        print("\n⚠️  Skipping Options Chain test (no expiry date available)")
        results['Options Chain'] = False

    # Test 5: Volatility
    results['Volatility'] = test_volatility(symbol)

    # Test 6: Symbol Search
    results['Symbol Search'] = test_symbol_search("apple")

    # Test 7: Validate Symbol
    results['Validate Symbol'] = test_validate_symbol(symbol)

    # Print summary
    print(f"\n{'='*60}")
    print("TEST SUMMARY")
    print(f"{'='*60}")

    passed = sum(1 for v in results.values() if v)
    total = len(results)

    for test, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test:.<40} {status}")

    print(f"\n{'-'*60}")
    print(f"Results: {passed}/{total} tests passed")

    if passed == total:
        print("🎉 All tests passed! Your API is working perfectly!")
    else:
        print("⚠️  Some tests failed. Check the output above for details.")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    try:
        main()
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Cannot connect to API server!")
        print("Make sure the backend is running:")
        print("  cd backend")
        print("  python main.py")
        print("\nThen run this test script again.")
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
