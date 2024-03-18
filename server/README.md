# Bento Rider App

Welcome to Bento Rider Server! This README.md file serves as a guide to understanding the main features of the app, its functionalities, and how to run it on your local machine.

## Main Features

The Bento Rider App is designed to streamline the delivery process and optimize rider efficiency. Here are the main features:

1. **Signup, Login, and Go Online:** Riders can easily sign up, log in, and switch to online mode to start receiving orders.
2. **Order Handling:** Riders can receive, collect, and deliver orders efficiently, ensuring timely and accurate delivery to customers.
3. **Hub Assignment:** Hubs are assigned to riders to load balance restaurant orders and optimize delivery routes.
4. **Order Assignment:** Orders are intelligently assigned to riders to maximize their utilization and minimize delivery time.
5. **Utilization Monitoring:** The app monitors hub utilization to ensure efficient resource allocation and maintain service quality.

## Folder Structure

```plaintext
.
└── src
    └── controllers
    └── interfaces
    └── middleware
    └── models
        └── customer
        └── helperSchemas
        └── hub
        └── longLat
        └── order
        └── rider
        └── riderDailyRecords
    └── routers
    └── services
    └── utils
    └── config.ts
    └── index.ts
```

## Getting Started

### How to Run the App Locally

To run the server on your local machine, follow these steps:

1. Clone the repository: `git clone https://github.com/Project-Code-Projects/bento-delivery-server.git`
2. Navigate to the project directory: `cd bento-delivery-server`
3. Install dependencies: `npm install`
4. Create a `.env` file based on the provided `.env.example` file.
5. Fill in the necessary information in the `.env` file according to the example keys provided.
6. Start the server: `npm start`

<!-- ### Live Link

Currently, there is no live version of the app available. -->

### Bento Rider App Info

The Bento Rider App plays a crucial role in the Bento ecosystem by ensuring efficient delivery operations. It facilitates the seamless movement of orders from restaurants to customers, optimizing delivery routes and minimizing delivery times. By utilizing intelligent assignment algorithms and hub utilization monitoring, the app maximizes the productivity of riders while maintaining service quality.

## Commit types:

- build
  -chore
  -ci
  -docs
  -feat
  -fix
  -perf
  -refactor
  -revert
  -style
  -test
