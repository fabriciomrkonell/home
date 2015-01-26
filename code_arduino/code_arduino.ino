#include <SPI.h>
#include <Ethernet.h>

byte mac[] = { 0x90, 0xA2, 0xDA, 0x00, 0x6C, 0xFE };
IPAddress ip(192,168,0,225);
IPAddress server(192,168,0,5);
EthernetClient client;

// Variáveis pinagem
int pin2 = 2;
int pin3 = 3;
int pin4 = 4;
int pin5 = 5;

// Variáveis medições
int _pin2 = 0;
int _pin3 = 0;

// Variáveis leitura
String _text = "";
int __pin2 = 0;
int __pin3 = 0;

void setup() {
  Ethernet.begin(mac, ip);
  Serial.begin(9600);
  delay(1000);
  Serial.println("Conectando.");
  if (client.connect(server, 1337)) {
    Serial.println("Conectado.");
  } else {
    Serial.println("Erro: Conexão falhou.");
  }
   
  // Buzzer
  pinMode(pin2, OUTPUT);
  digitalWrite(pin2, 0);
  pinMode(pin3, INPUT); 
   
};

void loop() {
  if (client.available()) {
    char c = client.read();
    getString(c);      
  }
  buttons();
};

// Configuração dos interruptores
void buttons(){
   
  // Buzzer
  __pin3 = digitalRead(pin3);
  if (__pin3 == 0){
    if(__pin3 == _pin3){
      toogle(String(pin2), __pin3);
      _pin3 = 1;
    }
  }else{
    _pin3 = 0;
  }
  
};


// Toogle valor sensor
void toogle(String pin, int value){
  value = !value;
  setServer(pin, String(value));
};

// Envia dados pro server
void setServer(String pin, String value){
  setSensor(pin.toInt(), value.toInt());
  client.print(pin + ";" + value);
};

// Envia dados pro sensor
void setSensor(int pin, int type){
  digitalWrite(pin, type);
};

// Pegar o valor de leitura
void getString(char _txt) {
  String txt(_txt);
  if(txt == "<"){
    _text = "";
  }else if(txt == ">"){
    setSensor(getValue(_text, ',', 0).toInt(), getValue(_text, ',', 1).toInt());
  }else{
    _text = _text + _txt;
  }
};

// Split na string recebida
String getValue(String data, char separator, int index) {
  int found = 0;
  int strIndex[] = { 0, -1 };
  int maxIndex = data.length()-1;
  for(int i=0; i<=maxIndex && found<=index; i++){
    if(data.charAt(i)==separator || i==maxIndex){
      found++;
      strIndex[0] = strIndex[1]+1;
      strIndex[1] = (i == maxIndex) ? i+1 : i;
    }
   }
  return found>index ? data.substring(strIndex[0], strIndex[1]) : "";
};
