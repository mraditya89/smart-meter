#include "AES.h"
#include "base64.h"
#include <SPI.h>
#include <LoRa.h>
#include "mbedtls/md.h"


AES aes;

// Our AES key. Note that is the same that is used on the Node-Js side but as hex bytes.
byte key[] = { 0x2B, 0x7E, 0x15, 0x16, 0x28, 0xAE, 0xD2, 0xA6, 0xAB, 0xF7, 0x15, 0x88, 0x09, 0xCF, 0x4F, 0x3C };

// The unitialized Initialization vector
byte my_iv[N_BLOCK] = { 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};

char *rcvd_data;

uint8_t getrnd() {
    uint8_t really_random = *(volatile uint8_t *)0x3FF20E44;
    return really_random;
}

// Generate a random initialization vector
void gen_iv(byte  *iv) {
    for (int i = 0 ; i < N_BLOCK ; i++ ) {
        iv[i]= (byte) getrnd();
    }
}


byte opCode;
unsigned char n;
unsigned char R;
unsigned char first;

union buffer4Byte {
    byte buffer[4];
    unsigned long numberLong;
    float numberFloat;
};

union buffer2Byte {
    byte buffer[2];
    uint16_t number;
};

union buffer4Byte meterID;
union buffer4Byte E_tot;
union buffer4Byte E_all;

struct DateTime {
    uint8_t day;
    uint8_t month;
    union buffer2Byte year;
    uint8_t hour;
    uint8_t minute;
    uint8_t second;
};

struct DateTime randomTime;

char nfcCode[16];

char payload[37];


void printHexChar(const byte *data, const uint32_t numBytes) {
    uint32_t szPos;
    Serial.printf("0X");
    for (szPos = 0; szPos < numBytes; szPos++) {
        // Append leading 0 for small values
        if (data[szPos] <= 0xF)
            Serial.printf("0");
            Serial.printf("%X", data[szPos]);
        if ((numBytes > 1) && (szPos != numBytes - 1)) {
            Serial.printf(" ");
        }
    }
    Serial.printf("\n");
}


void generatePayload() {
    // Generating OPCODE
    opCode = (byte) random(0,8);
    Serial.printf("opcode\t\t\t= "); printHexChar(&opCode, sizeof(opCode));

    // Generating Status Code
    n = (unsigned char) random(0,3);
    R = (unsigned char) random(0,4);
    Serial.printf("n\t\t\t= %u - ", n); printHexChar(&n, sizeof(n));
    Serial.printf("R\t\t\t= %u - ", R); printHexChar(&R, sizeof(R));

    // Combining OPCODE and Status Code to make Byte-0
    first = 0x00;
    first |= opCode;
    first = (first << 2) | n;
    first = (first << 2) | R;
    Serial.printf("Byte-0\t\t\t= "); printHexChar(&first, sizeof(first));
    Serial.printf("\n");

    // Generating Meter_ID
    meterID.numberLong = (unsigned long) random(0, 1000000);
    Serial.printf("Meter ID\t\t= %lu - ", meterID.numberLong); printHexChar(meterID.buffer, sizeof(meterID.buffer));
    Serial.printf("\n");

    // Generating random time
    randomTime.day = (uint8_t) random(1, 31);
    randomTime.month = (uint8_t) random(1, 13);
    randomTime.year.number = (uint16_t) random (1920, 2100);
    randomTime.hour = (uint8_t) random(0, 24);
    randomTime.minute = (uint8_t) random(0, 60);
    randomTime.second = (uint8_t) random(0, 60);

    Serial.printf("day\t\t\t= %u - ", randomTime.day); printHexChar(&(randomTime.day), sizeof(randomTime.day));
    Serial.printf("month\t\t\t= %u - ", randomTime.month); printHexChar(&(randomTime.month), sizeof(randomTime.month));
    Serial.printf("year\t\t\t= %u - ", randomTime.year.number); printHexChar(randomTime.year.buffer, sizeof(randomTime.year.buffer));
    Serial.printf("hour\t\t\t= %u - ", randomTime.hour); printHexChar(&(randomTime.hour), sizeof(randomTime.hour));
    Serial.printf("minute\t\t\t= %u - ", randomTime.minute); printHexChar(&(randomTime.minute), sizeof(randomTime.minute));
    Serial.printf("second\t\t\t= %u - ", randomTime.second); printHexChar(&(randomTime.second), sizeof(randomTime.second));
    Serial.printf("\n");

    // Generating Total and Allocated Energy (each of which is 4 bytes)
    unsigned long num1 = (unsigned long) random(1, 1000000);
    unsigned long num2 = (unsigned long) random(1, 1000000);
    E_tot.numberFloat = (float) num1 / num2;
    Serial.printf("Total Energy\t\t= %f - ", E_tot.numberFloat); printHexChar(E_tot.buffer, sizeof(E_tot.buffer));

    num1 = (unsigned long) random(1, 1000000);
    num2 = (unsigned long) random(1, 1000000);
    E_all.numberFloat = (float) num1 / num2;
    Serial.printf("Allocated Energy\t= %f - ", E_all.numberFloat); printHexChar(E_all.buffer, sizeof(E_all.buffer));
    Serial.printf("\n");

    // Generating NFC Code
    union buffer4Byte concatenator;
    for(char i = 0; i < 16; i += 4) {
        long a = random(-1000000, 1000000);
        long b = random(-1000000, 1000000);
        concatenator.numberFloat = (float) a / b;
        nfcCode[i] = (char) concatenator.buffer[0];
        nfcCode[i + 1] = (char) concatenator.buffer[1];
        nfcCode[i + 2] = (char) concatenator.buffer[2];
        nfcCode[i + 3] = (char) concatenator.buffer[3];
    }
    Serial.printf("NFC Code\t\t= "); printHexChar((byte *) nfcCode, sizeof(nfcCode));
    Serial.printf("\n");

    // Generating payload string
    payload[0] = first;

    for(unsigned char i = 0; i < 4; i++) {
        payload[1 + i] = (unsigned char) meterID.buffer[i];
    }

    payload[5] = (unsigned char) randomTime.day;
    payload[6] = (unsigned char) randomTime.month;
    payload[7] = (unsigned char) randomTime.year.buffer[0];
    payload[8] = (unsigned char) randomTime.year.buffer[1];
    payload[9] = (unsigned char) randomTime.hour;
    payload[10] = (unsigned char) randomTime.minute;
    payload[11] = (unsigned char) randomTime.second;

    for(unsigned char i = 0; i < 4; i++) {
        payload[12 + i] = (unsigned char) E_tot.buffer[i];
    }
    for(unsigned char i = 0; i < 4; i++) {
        payload[16 + i] = (unsigned char) E_all.buffer[i];
    }

    for(unsigned char i = 0; i < 16; i++) {
        payload[20 + i] = nfcCode[i];
    }

    payload[36] = '\0';

    Serial.printf("PAYLOAD:\n"); printHexChar((byte *) payload, sizeof(payload));
    Serial.printf("\n");
}

void parsePayload() {
    // Objective: to parse the payload that has been generated with generatePayload()

    // Translating the parsed code
    Serial.printf("----------------------------------------------\n");
    Serial.printf("PARSING PAYLOAD\n");

    // Obtain the components of the payload
    Serial.printf("Number of bytes on payload = %u\n", sizeof(payload));
    if(sizeof(payload) > 36) {
        unsigned char first_rec = payload[0];

        byte opCode_rec;
        unsigned char n_rec, R_rec;
        R_rec = first_rec & 0x3;
        n_rec = (first_rec >> 2) & 0x3;
        opCode_rec = first_rec >> 4;

        union buffer4Byte meterID_rec;
        for(unsigned char i = 0; i < 4; i++) {
            meterID_rec.buffer[i] = (byte) payload[1 + i];
        }

        struct DateTime timeRec;
        timeRec.day = (uint8_t) payload[5];
        timeRec.month = (uint8_t) payload[6];
        timeRec.year.buffer[0] = (byte) payload[7];
        timeRec.year.buffer[1] = (byte) payload[8];
        timeRec.hour = (uint8_t) payload[9];
        timeRec.minute = (uint8_t) payload[10];
        timeRec.second = (uint8_t) payload[11];

        union buffer4Byte E_tot_rec, E_all_rec;
        for(unsigned char i = 0; i < 4; i++) {
            E_tot_rec.buffer[i] = (byte) payload[12 + i];
        }
        for(unsigned char i = 0; i < 4; i++) {
            E_all_rec.buffer[i] = (byte) payload[16 + i];
        }

        char nfcCode_rec[16];
        for(unsigned char i = 0; i < 16; i++) {
            nfcCode_rec[i] = payload[20 + i];
        }

        // Printing payload components
        Serial.printf("Opcode\t\t\t= "); printHexChar(&opCode_rec, sizeof(opCode_rec));
        Serial.printf("n\t\t\t= %u - ", n_rec); printHexChar(&n_rec, sizeof(n_rec));
        Serial.printf("R\t\t\t= %u - ", R_rec); printHexChar(&R_rec, sizeof(R_rec));
        Serial.printf("Byte-0\t\t\t= "); printHexChar(&first_rec, sizeof(first_rec));
        Serial.printf("Meter ID\t\t= %lu - ", meterID_rec.numberLong); printHexChar(meterID_rec.buffer, sizeof(meterID_rec.buffer));
        Serial.printf("Day\t\t\t= %u - ", timeRec.day); printHexChar(&(timeRec.day), sizeof(timeRec.day));
        Serial.printf("Month\t\t\t= %u - ", timeRec.month); printHexChar(&(timeRec.month), sizeof(timeRec.month));
        Serial.printf("Year\t\t\t= %u - ", timeRec.year.number); printHexChar(timeRec.year.buffer, sizeof(timeRec.year.buffer));
        Serial.printf("Hour\t\t\t= %u - ", timeRec.hour); printHexChar(&(timeRec.hour), sizeof(timeRec.hour));
        Serial.printf("Minute\t\t\t= %u - ", timeRec.minute); printHexChar(&(timeRec.minute), sizeof(timeRec.minute));
        Serial.printf("Second\t\t\t= %u - ", timeRec.second); printHexChar(&(timeRec.second), sizeof(timeRec.second));
        Serial.printf("Total Energy\t\t= %f - ", E_tot_rec.numberFloat); printHexChar(E_tot_rec.buffer, sizeof(E_tot_rec.buffer));
        Serial.printf("Allocated Energy\t= %f - ", E_all_rec.numberFloat); printHexChar(E_all_rec.buffer, sizeof(E_all_rec.buffer));
        Serial.printf("NFC Code\t\t= "); printHexChar((byte *) nfcCode_rec, sizeof(nfcCode_rec));

        // Translating the parsed code
        Serial.printf("----------------------------------------------\n");
        Serial.printf("TRANSLATING PAYLOAD\n");

        switch(opCode_rec) {
            case 0x00 : Serial.printf("Code: NULL - no state parameters will be changed\n");
                        break;
            // case 0x01 : Serial.printf("Code: PERUBAHAN STATUS METERAN (METER->SERVER)\n");
            //             Serial.printf("Received parameters:\n");
            //             Serial.printf("Opcode\t\t\t= "); printHexChar(&opCode_rec, sizeof(opCode_rec));
            //             Serial.printf("n\t\t\t= %u\n", n_rec);
            //             Serial.printf("R\t\t\t= %u\n", R_rec);
            //             Serial.printf("Meter ID\t\t= %lu\n", meterID_rec.numberLong);
            //             Serial.printf("Time\t\t\t= ");
            //             Serial.printf("{%02u:%02u:%02u, ", timeRec.hour, timeRec.minute, timeRec.second);
            //             Serial.printf("%02u-%02u-%04u}\n", timeRec.day, timeRec.month, timeRec.year.number);
            //             break;
            case 0x01 : Serial.printf("Invalid opcode, should be used for endpoint to server transmission!\n");
                        break;
            // case 0x02 : Serial.printf("Code: NFC (METER->SERVER)\n");
            //             Serial.printf("Received parameters:\n");
            //             Serial.printf("Opcode\t\t\t= "); printHexChar(&opCode_rec, sizeof(opCode_rec));
            //             Serial.printf("Meter ID\t\t= %lu\n", meterID_rec.numberLong);
            //             Serial.printf("Time\t\t\t= ");
            //             Serial.printf("{%02u:%02u:%02u, ", timeRec.hour, timeRec.minute, timeRec.second);
            //             Serial.printf("%02u-%02u-%04u}\n", timeRec.day, timeRec.month, timeRec.year.number);
            //             Serial.printf("NFC Token\t\t= "); printHexChar((byte *) nfcCode_rec, sizeof(nfcCode_rec));
            //             break;
            case 0x02 : Serial.printf("Invalid opcode, should be used for endpoint to server transmission!\n");
                        break;
            // case 0x03 : Serial.printf("Code: LAPORAN KONSUMSI ENERGI (METER->SERVER)\n");
            //             Serial.printf("Received parameters:\n");
            //             Serial.printf("Opcode\t\t\t= "); printHexChar(&opCode_rec, sizeof(opCode_rec));
            //             Serial.printf("Meter ID\t\t= %lu\n", meterID_rec.numberLong);
            //             Serial.printf("Time\t\t\t= ");
            //             Serial.printf("{%02u:%02u:%02u, ", timeRec.hour, timeRec.minute, timeRec.second);
            //             Serial.printf("%02u-%02u-%04u}\n", timeRec.day, timeRec.month, timeRec.year.number);
            //             Serial.printf("Total Energy\t\t= %f\n", E_tot_rec.numberFloat);
            //             Serial.printf("Allocated Energy\t= %f\n", E_all_rec.numberFloat);
            //             break;
            case 0x03 : Serial.printf("Invalid opcode, should be used for endpoint to server transmission!\n");
                        break;
            case 0x04 : Serial.printf("Code: ACKNOWLEDGEMENT\n");
                        Serial.printf("Received parameters:\n");
                        Serial.printf("Opcode\t\t\t= "); printHexChar(&opCode_rec, sizeof(opCode_rec));
                        Serial.printf("Meter ID\t\t= %lu\n", meterID_rec.numberLong);
                        Serial.printf("Time\t\t\t= ");
                        Serial.printf("{%02u:%02u:%02u, ", timeRec.hour, timeRec.minute, timeRec.second);
                        Serial.printf("%02u-%02u-%04u}\n", timeRec.day, timeRec.month, timeRec.year.number);
                        break;
            case 0x05 : Serial.printf("Code: PERUBAHAN STATUS METERAN (SERVER->METER)\n");
                        Serial.printf("Received parameters:\n");
                        Serial.printf("Opcode\t\t\t= "); printHexChar(&opCode_rec, sizeof(opCode_rec));
                        Serial.printf("n\t\t\t= %u\n", n_rec);
                        Serial.printf("R\t\t\t= %u\n", R_rec);
                        Serial.printf("Meter ID\t\t= %lu\n", meterID_rec.numberLong);
                        Serial.printf("Time\t\t\t= ");
                        Serial.printf("{%02u:%02u:%02u, ", timeRec.hour, timeRec.minute, timeRec.second);
                        Serial.printf("%02u-%02u-%04u}\n", timeRec.day, timeRec.month, timeRec.year.number);
                        break;
            case 0x06 : Serial.printf("Code: PRIVATE KEY CHANGE (SERVER->METER)\n");
                        Serial.printf("Received parameters:\n");
                        Serial.printf("Opcode\t\t\t= "); printHexChar(&opCode_rec, sizeof(opCode_rec));
                        Serial.printf("Meter ID\t\t= %lu\n", meterID_rec.numberLong);
                        Serial.printf("Time\t\t\t= ");
                        Serial.printf("{%02u:%02u:%02u, ", timeRec.hour, timeRec.minute, timeRec.second);
                        Serial.printf("%02u-%02u-%04u}\n", timeRec.day, timeRec.month, timeRec.year.number);
                        Serial.printf("New Key\t\t= "); printHexChar((byte *) nfcCode_rec, sizeof(nfcCode_rec));
                        break;
            case 0x07 : Serial.printf("Code: TRIGGER PELAPORAN KONSUMSI ENERGI (SERVER->METER)\n");
                        Serial.printf("Received parameters:\n");
                        Serial.printf("Opcode\t\t\t= "); printHexChar(&opCode_rec, sizeof(opCode_rec));
                        Serial.printf("Meter ID\t\t= %lu\n", meterID_rec.numberLong);
                        Serial.printf("Time\t\t\t= ");
                        Serial.printf("{%02u:%02u:%02u, ", timeRec.hour, timeRec.minute, timeRec.second);
                        Serial.printf("%02u-%02u-%04u}\n", timeRec.day, timeRec.month, timeRec.year.number);
                        break;
            case 0x08 : Serial.printf("Code: UPDATE ALLOCATION (SERVER->METER)\n");
                        Serial.printf("Received parameters:\n");
                        Serial.printf("Opcode\t\t\t= "); printHexChar(&opCode_rec, sizeof(opCode_rec));
                        Serial.printf("Meter ID\t\t= %lu\n", meterID_rec.numberLong);
                        Serial.printf("Time\t\t\t= ");
                        Serial.printf("{%02u:%02u:%02u, ", timeRec.hour, timeRec.minute, timeRec.second);
                        Serial.printf("%02u-%02u-%04u}\n", timeRec.day, timeRec.month, timeRec.year.number);
                        Serial.printf("Added energy\t= %f\n", E_all_rec.numberFloat);
                        break;
            default :   Serial.printf("Code: INVALID OPCODE\n");
        }


    } else {
        // Things went wrong when the received payload is less than 37 bytes
        Serial.printf("Payload corrupted!\n");
    }
}

char *node_id = "<4567>";  //From LG01 via web Local Channel settings on MQTT.Please refer <> dataformat in here.
uint8_t datasend[128];
char b64data[200];
char b64payload[200];
byte hmacResult[32];

const int csPin = 13;          // LoRa radio chip select (NSS)
const int resetPin = 12;        // LoRa radio reset (RST)
const int irqPin = 2;          // change for your board; must be a hardware interrupt pin (DIO0)

void setup() {
    Serial.begin(115200);

    // if analog input pin 36 is unconnected, random analog
    // noise will cause the call to randomSeed() to generate
    // different seed numbers each time the sketch runs.
    // randomSeed() will then shuffle the random function.
    randomSeed(analogRead(36));

    LoRa.setPins(csPin, resetPin, irqPin);
    while (!Serial);
    Serial.println(F("Start MQTT Example"));
    if (!LoRa.begin(923600000))   //923600000 is frequency
    {
        Serial.println("Starting LoRa failed!");
        while (1);
    }
    // Setup Spreading Factor (6 ~ 12)
    LoRa.setSpreadingFactor(9);

    // Setup BandWidth, option: 7800,10400,15600,20800,31250,41700,62500,125000,250000,500000
    //Lower BandWidth for longer distance.
    LoRa.setSignalBandwidth(125000);

    // Setup Coding Rate:5(4/5),6(4/6),7(4/7),8(4/8)
    LoRa.setCodingRate4(5);
    LoRa.setSyncWord(0x34);
    Serial.println("LoRa init succeeded.");

    LoRa.onReceive(onReceive);
    LoRa.receive();
}

void SendData()
{
     LoRa.beginPacket();
     LoRa.print((char *)datasend);
     LoRa.endPacket();
     Serial.println("Packet Sent");
}

unsigned long new_time,old_time=0; //for millis loop

unsigned long currTime = millis();

void loop() {
    new_time=millis();
    if (new_time - old_time >= 10000 || old_time == 0)
    {
      old_time = new_time;
      Serial.printf("\n==============================================\n");
      Serial.printf("GENERATING PAYLOAD\n");
      generatePayload();
      envelop_data();
      SendData();
    }

//    if(millis() - currTime > 700) {
//        LoRa.receive();
//        currTime = millis();
//    }

}


void onReceive(int packetSize) {

  // received a packet
  Serial.printf("\n==============================================\n");
  Serial.print("\nReceived packet : ");
  rcvd_data = (char*)malloc(packetSize * sizeof(char));
  // read packet
  for (int i = 0; i < packetSize; i++) {
    rcvd_data[i]= (char)LoRa.read();
    Serial.print(rcvd_data[i]);
  }
  Serial.print("\n\r");
  char *iv  = "AAAAAAAAAAAAAAAAAAAAAA==";
  decrypt(rcvd_data, String(iv), 108);
}

void envelop_data(){
  char data[128] = "\0";
  char with_hmac[128] = "\0";
  for(int i = 0; i < 50; i++)
  {
     data[i] = node_id[i];
  }
  int b64payloadlen = base64_encode(b64payload, payload, sizeof(payload));
  Serial.print("\nb64payload: "+String(b64payload));
  getHMAC(b64payload);
  for(int i= 0; i< 3; i++){
      char temp[3];
      sprintf(temp, "%02x", (int)hmacResult[i]);
      strcat(with_hmac,temp);
  }
  strcat(with_hmac,b64payload);
  encrypt_payload(with_hmac,b64payloadlen+6);
  strcat(data,b64data);

  strcpy((char *)datasend,data);
}


void encrypt_payload(char *msg, int b64payloadlen){
    byte cipher[1000];
    byte iv [N_BLOCK] ;
    char decoded[37];
    Serial.println("Let's encrypt:");

    // Our message to encrypt. Static for this example.
    //String msg = "{\"data\":{\"value\":300}, \"SEQN\":700 , \"msg\":\"IT WORKS!!\" }";
//    String msg = String(payload);
    aes.set_key( key , sizeof(key));  // Get the globally defined key
    gen_iv( my_iv );                  // Generate a random IV

    // Print the IV
    base64_encode( b64data, (char *)my_iv, N_BLOCK);
    Serial.println(" IV b64: " + String(b64data));

//    Serial.println(" Message: " + msg );

    int b64len = base64_encode(b64data, (char *)msg, b64payloadlen);
    Serial.println (" Message in B64: " + String(b64data) );
    Serial.println (" The length is:  " + String(b64len) );

    // For sanity check purpose
//    base64_decode( decoded , b64data , b64len );
//    Serial.printf("Decoded:\n"); printHexChar((byte *) decoded, 37);

    // Encrypt! With AES128, our key and IV, CBC and pkcs7 padding
    aes.do_aes_encrypt((byte *)b64data, b64len , cipher, key, 128, my_iv);

    Serial.println("Encryption done!");

    Serial.println("Cipher size: " + String(aes.get_size()));

    b64len = base64_encode(b64data, (char *)cipher, aes.get_size() );
    Serial.println ("Encrypted data in base64: " + String(b64data) );
    Serial.println (" The length is:  " + String(b64len) );

    Serial.println("Done...");
}

//ini fungsi untuk menghitung HMAC
int getHMAC(char *payload){

  char *key = "secretKey";

  mbedtls_md_context_t ctx;
  mbedtls_md_type_t md_type = MBEDTLS_MD_SHA256;

  const size_t payloadLength = strlen(payload);
  const size_t keyLength = strlen(key);

  mbedtls_md_init(&ctx);
  mbedtls_md_setup(&ctx, mbedtls_md_info_from_type(md_type), 1);
  mbedtls_md_hmac_starts(&ctx, (const unsigned char *) key, keyLength);
  mbedtls_md_hmac_update(&ctx, (const unsigned char *) payload, payloadLength);
  mbedtls_md_hmac_finish(&ctx, hmacResult);
  mbedtls_md_free(&ctx);

  Serial.print("\nHash: ");

  for(int i= 0; i< sizeof(hmacResult); i++){
      char str[3];

      sprintf(str, "%02x", (int)hmacResult[i]);
      Serial.print(str);
  }
}

void decrypt(String b64data_rcvd, String IV_base64, int lsize)
{
  char data_decoded[200];
  char iv_decoded[200];
  byte out[200];
  char temp[200];
  b64data_rcvd.toCharArray(temp, 200);
  base64_decode(data_decoded, temp, b64data_rcvd.length());
  IV_base64.toCharArray(temp, 200);
  base64_decode(iv_decoded, temp, IV_base64.length());
  base64_encode( b64data, (char *)iv_decoded, N_BLOCK);
  Serial.println("\nIV b64: " + String(b64data));
  aes.do_aes_decrypt((byte *)data_decoded, lsize, out, key, 128, (byte *)iv_decoded);
  char message[100];
  base64_decode(message, (char *)out, 80);
  Serial.print("Out: "+ String(message));
  char b64payload[80];
  char HMAC[7]="\0";
  char rcvd_HMAC[7]="\0";
  for (int i=6;i<80;i++)
  {
    b64payload[i-6]=message[i];
  }
  for (int i=0;i<6;i++)
  {
    HMAC[i]=message[i];
  }
  Serial.print("\nPayload: "+ String(b64payload));
  Serial.print("\nHMAC: "+String(HMAC));
  getHMAC(b64payload);
  for(int i= 0; i< 3; i++){
    char temp[3];
    sprintf(temp, "%02x", (int)hmacResult[i]);
    strcat(rcvd_HMAC,temp);
  }
  if(strcmp(rcvd_HMAC, HMAC) == 0){
    base64_decode(payload, b64payload, sizeof(b64payload));
    Serial.printf("\nRECEIVED PAYLOAD:\n"); printHexChar((byte *) payload, sizeof(payload));
    parsePayload();
  }
  else
  {
    Serial.print(strcmp(rcvd_HMAC,HMAC));
    Serial.print("\n");
    Serial.print(String(rcvd_HMAC));
    Serial.print("\n");
    Serial.print(String(HMAC));
  }

}

void setup_aes()
{
  aes.set_key(key, sizeof(key)); // Get the globally defined key
}
