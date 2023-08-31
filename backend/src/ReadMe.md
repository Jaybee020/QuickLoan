# API Documentation

This document provides information about the API routes exposed by the application.

## Get User Operation by ID

Retrieve a user operation by its ID.

- **URL**: `/operation/:id`
- **Method**: GET
- **URL Parameters**:
  - `id` (string): The ID of the user operation to retrieve.
- **Response**:
  - **Status Code**: 200 (OK) or 400 (Bad Request)
  - **Response Body**:
    ```json
    {
      "data": {
        /* User operation details */
      }
    }
    ```

## Get User Operation by Email

Retrieve a user operation by email.

- **URL**: `/operation/user/:email`
- **Method**: GET
- **URL Parameters**:
  - `email` (string): The email of the user associated with the operation.
- **Response**:
  - **Status Code**: 200 (OK) or 400 (Bad Request)
  - **Response Body**:
    ```json
    {
      "data": {
        /* User operation details */
      }
    }
    ```

## Create User Operation

Create a new user operation.

- **URL**: `/operation`
- **Method**: POST
- **Request Body**:

  ```json
  {
    "email": "user@example.com",
    "actions": [
      /* Array of actions */
    ],
    "type": "COMPOUND"| "TOKEN" |"TRANSFER"
  }

  ```

USER

# User API Documentation

This document provides information about the API methods provided by the `User` class.

## Get User by ID

Retrieve a user by their ID.

- **Method**: `getById(id: string)`
- **Parameters**:
  - `id` (string): The ID of the user to retrieve.
- **Returns**:
  - Returns a Promise that resolves to the user details if found, or `null` if not found.

## Get Smart Account Wallet Details

Retrieve the wallet details of a user's smart account.

- **Method**: `getSmartAccountWallet(id: string)`
- **Parameters**:
  - `id` (string): The ID of the user whose smart account details are to be retrieved.
- **Returns**:
  - Returns a Promise that resolves to an object containing:
    - `balance`: The token balance of the user's smart account.
    - `addr`: The address of the smart account.

## Get User by Email

Retrieve a user by their email.

- **Method**: `getByEmail(email: string)`
- **Parameters**:
  - `email` (string): The email of the user to retrieve.
- **Returns**:
  - Returns a Promise that resolves to the user details if found, or `null` if not found.

## Get User Subscriptions

Retrieve subscriptions associated with a user.

- **Method**: `getSubscriptions(email: string)`
- **Parameters**:
  - `email` (string): The email of the user whose subscriptions are to be retrieved.
- **Returns**:
  - Returns a Promise that resolves to an array of subscription details associated with the user.

## Create User

Create a new user.

- **Method**: `create(custodialAddress: string, email: string)`
- **Parameters**:
  - `custodialAddress` (string): The custodial address of the user.
  - `email` (string): The email of the user.
- **Returns**:
  - Returns a Promise that resolves to the created user's details.

## Get User Balance

Retrieve the balance of a user's account.

- **Method**: `getBalance()`
- **Returns**:
  - This method is defined but doesn't have a documented implementation in the provided code.

---

**Note**: This documentation assumes that the methods are part of the `User` class and are accessed using the `User` instance exported from the module.
