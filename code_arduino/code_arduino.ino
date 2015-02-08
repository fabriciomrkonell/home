#include <SPI.h>
#include <Ethernet.h>

byte mac[] = { 0x90, 0xA2, 0xDA, 0x00, 0x6C, 0xFE };
IPAddress ip(192,168,2,99);
IPAddress server(192,168,2,218);
EthernetClient client;

// Variáveis
int pins[] = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 };
int sensor[] = { 2, 3, 5, 6 };

// Pinos
int pinSensor[] = { 2, 3, 5, 6 };
int pinOutros[] = { 7, 8, 9 };

// Variáveis de últimas medições
int realPins[] = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
int realSensor[] = { 0, 0, 0, 0 };

int totalSensor = 4;
int totalOutros = 3;


void setup() {
  Ethernet.begin(mac, ip);
  Serial.begin(9600);
  delay(1000);
  Serial.println("Conectando.");
  if (client.connect(server, 1337)) {
    Serial.println("Conectado.");
  } else {
    Serial.println("Erro: Conexão falhou.");
  }; 
  
  // Pins réle
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(5, OUTPUT);
  pinMode(6, OUTPUT);
  
  // Pins outros
  pinMode(7, OUTPUT);
  pinMode(8, OUTPUT);
  pinMode(9, OUTPUT);
   
};

void loop() {

  int sensorValue = analogRead(A0);
  int outputValue = map(sensorValue, 0, 1023, -30, 30); 
  Serial.print("Sensor: "); 
  Serial.print(sensorValue);    
  Serial.print("Valor em Amperes: "); 
  Serial.println(outputValue);   
  
  if (client.available()) {
    char c = client.read();
    _readString(c);      
  }
  _setServer();
};

void _readString(char pin) {
  String _pin(pin);
  realPins[_pin.toInt()] = !realPins[_pin.toInt()];  
    
  digitalWrite(_pin.toInt(), realPins[_pin.toInt()]);

  for(int i = 0; i < totalOutros; i++){
    if(pinOutros[i] == _pin.toInt()){
      client.print(_pin + "-" + realPins[_pin.toInt()]);
    }
  }  
 
};

void _setServer(){
  
  for(int i = 0; i < totalSensor; i++){
    if(digitalRead(sensor[i]) != realSensor[i]){
      realSensor[i] = digitalRead(sensor[i]);
      client.print(String(pinSensor[i]) + "-" + String(realSensor[i]));
    }
  }    
  
}
