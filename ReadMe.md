<h3 align="center">QUICKLOAN</h3>
<h4 align="center">Blockchain interaction at its easiest.</h4>

## 🎯 Features

<sup>[(Back to top)](#------------------------)</sup>

### Perform blockchain operations in the easiest way possible.

Our project astracts away the complexities and repetitive nature of blockchain operations allowing you to easily and securely interact with your assets
Here's how we make it happen:

#### 1. RALLY SDK

This is used on the mobile app to create a local wallet that is then used as a signer for the smart contract wallet. This wallet is completely abstracted away from the user and is only used in the background.

#### 2. Alchemy Account Abstraction

With Alchemy's account abstraction, we are able to generate smart account wallets for users. This allows us to aggregate as many user operations as possible and forward it to their smart account wallet. Alchemy also allows us to sponsor the transactions for the users, hence we are able to relief users the stress of paying gas.

#### 3. Circle Payments API

Using Circle Payments API, we were able to implement a subscription model fee. This allows users to decide to top off their accounts with USDC which is used to pay gas fees of their transactions behind the scenes.

#### Supported Chains and Tokens

Here's an overview of actions we currently support;

- NATIVE TOKEN TRANSFER- This allows users to directly send the native token from their smart contract account to the recipient.
- MULI TOKEN TRANSFER- This allows users to send as many tokens to as many recipients as possible in just one transactions.
- COMPOUND - This enables users to perform as many compound transactions as possible(e.g supply WETH ,supply WBTC, withdraw USDC,) in just one transaction
- We also simulate the execution of the callData to see if the transactions would revert using **alchemy_simulate execution**.
- Users can top up their accounts using USDC and use this balance to pay for their gas behind the scenes.

### Affordable Transaction Fees

We believe in cost-effective solutions. Our platform offers a reasonable fee structure:

- 3% fee whenever users decide to top up their accounts.

### Upcoming Enhancements

We're committed to continuous improvement. Here's what's in the pipeline:

- **Expanded Operation Support:** We're working to add more different types of blockchain operations, such as swapping , depositing into pools e.tc.
- **Multi-Operations:** Soon, you'll enjoy the freedom of performing as many operations as possible of different types in just one call. For example, withdraw from WETH-USDC pool, provide collateral with the USDC on compound, then unwrap some of the WETH.

Stay tuned for these exciting enhancements!

## 🌵 Folder Structure

<sup>[(Back to top)](#------------------------)</sup>

```sh
.
├── backend   (Node js Application)
└── frontend  (React Native Mobile APP)
```

## 👍 Contributing

<sup>[(Back to top)](#------------------------)</sup>

We believe in the power of collaboration and welcome contributions from all members of the community irrespective of your domain knowledge and level of expertise,
your input is valuable.
Here are a few ways you can get involved:

- **Spread the Word**: Help us reach more enthusiasts by sharing the project with your network. The more creators and collectors we bring together, the stronger our community becomes.
- **Feature Requests**: If you have ideas for new features or improvements, share them with us! We're excited to hear how we can enhance the marketplace to better serve the community.
- **Code Contributions**: Developers can contribute by submitting pull requests. Whether it's fixing bugs, optimizing code, or adding new functionalities, your code contributions are invaluable.
- **Bug Reports and Feedback**: If you encounter any issues or have suggestions for improvement, please open an issue on GitHub.

## 👥 Team

<sup>[(Back to top)](#------------------------)</sup>

Meet the creative minds who brought this project to life:

| **Name**        | **Role**                     | **GitHub**                             |
| --------------- | ---------------------------- | -------------------------------------- |
| Olayinka Ganiyu | Backend Engineer             | [GitHub](https://github.com/Jaybee020) |
| Kester Atakere  | Designer & Frontend Engineer | [GitHub](https://github.com/codergon)  |
