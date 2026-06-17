def test_root(client):
    response = client.get("/")
    assert response.status_code == 200
    body = response.json()
    assert body["app"] == "MarketMind Labs"
    assert body["health"] == "/api/health"


def test_health(client):
    for path in ("/health", "/api/health"):
        response = client.get(path)
        assert response.status_code == 200
        assert response.json()["status"] == "ok"


def test_nifty_probability(client):
    response = client.post(
        "/api/probability/nifty",
        json={"open": 22000, "high": 22100, "low": 21950, "close": 22080},
    )
    assert response.status_code == 200
    data = response.json()
    assert "bull_probability" in data
    assert "bear_probability" in data
    assert "signal" in data
    assert 0 <= data["bull_probability"] <= 100


def test_reversal_times(client):
    response = client.get("/api/reversal-time/times")
    assert response.status_code == 200
    data = response.json()
    assert "times" in data
    assert isinstance(data["times"], list)
    assert len(data["times"]) > 0


def test_gann_square_of_9(client):
    response = client.post(
        "/api/gann/square-of-9",
        json={"price": 19500},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["price"] == 19500
    assert "levels" in data
    assert "cardinal_points" in data
    assert "ordinal_points" in data


def test_auth_register_and_login(client):
    email = "tester@example.com"
    password = "securepass123"

    register = client.post(
        "/api/auth/register",
        json={"name": "Tester", "email": email, "password": password},
    )
    assert register.status_code == 200
    token = register.json()["access_token"]
    assert token

    login = client.post(
        "/api/auth/login",
        json={"email": email, "password": password},
    )
    assert login.status_code == 200

    me = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {login.json()['access_token']}"},
    )
    assert me.status_code == 200
    assert me.json()["email"] == email
