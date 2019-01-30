module.exports = {
    "create_user": "INSERT INTO USERS (ID, USERNAME, EMAIL, PASSWORD, PROMO) VALUES ($id, $username, $email, $password, $promo)",
    "get_user_from_user_pass": "SELECT ID, USERNAME, EMAIL, PASSWORD, PROMO FROM USERS WHERE USERNAME = $username AND PASSWORD = $password",
    "get_user_from_id": "SELECT ID, USERNAME, EMAIL, PASSWORD, PROMO FROM USERS WHERE ID = $id"
}