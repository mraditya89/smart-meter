# smart-meter

![Tech Diagram](https://github.com/alijarasyidi/smart-meter/blob/master/repo-image/diagram-tech.jpg)

## Description
At the time of this project, there was no integration of electrical data communication systems for residential electricity meters in Indonesia. Data and control of electricity meters are carried out directly by electricity management officers. The same is the case with customers, to check the electricity data of the electricity meter, the customer needs to physically visit the meter unit to see the electricity usage data. This has caused several problems from both the user and the customer side. The digital electricity meter system is designed to design a data communication system on the electricity meter, so that usage and control data can be accessed easily from both the operator and the customer. The digital electricity meter is a smart electricity meter device based on the Internet-of-Things (IoT). This device has a two-way data communication system connected to the internet using LoRa® technology so that electrical data can be accessed digitally. One of the main features of the digital electricity meter is the addition of electricity pulses with payment through a payment gateway, so that users can make top-ups through payments at supermarkets, internet banking, or e-wallets. In addition, data on electricity meter usage can be accessed through the interface system by operators and customers. In this system, a data communication system architecture is made on a digital electricity meter, which includes a database, protocol, and server, allowing customers to access payments through a payment gateway. Customers can also access electricity meter data, control electricity meters, and notifications through the interface provided.

This repository contain implemented payment gateway system and interface system. The payment gateway service used is Midtrans. The customer interface is implemented with a mobile application, while the operator interface is with a web dashboard. The results of the payment gateway feature implementation and data access through the interface went well as expected.

## In This Project
- Customer Interface :
  - **server-mobile-app**
  - **mobile-app**
- **server-payment-gateway**
- Operator Interface :
  - **server-web-dashboard**
  - **web-dashboard**
