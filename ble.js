var myDevice;
var myService;

const devicePrefix = 'golioth';
const provServiceUuid = '1f45bcd1-4700-4b82-b278-745c86226373';
const wifiSsidUuid = '8d69e681-ea3a-488b-b88b-dd9fa552585a';
const wifiPasswordUuid = 'bb4e7294-57e2-4a13-9322-c35e6bd6dc49';
const goliothPskIdUuid = '54afcfe6-57f3-4b2e-b812-37ec84c4067a';
const goliothPskUuid = '96b7479b-368f-430e-bf47-b3404f28a2c8';

document.addEventListener('DOMContentLoaded', init, false);

function init() {
    if (!("bluetooth" in navigator)) {
        msg('Browser not supported');
        alert('Error: This browser doesn\'t support Web Bluetooth. Try using Chrome, and enable Web Bluetooth: chrome://flags/#enable-experimental-web-platform-features');
    }
}

function msg(m) {
    document.getElementById('status-label').innerHTML = m;
}

function onDisconnected(event) {
    msg('Device ' + event.target.name + ' is disconnected');
    document.getElementById('devconnected').innerHTML = 'No';
    if (document.getElementById('autoreconnect').checked) {
        connect();
    }
}

async function connect() {
    options = {
        filters: [
            {namePrefix: devicePrefix},
            {services: [provServiceUuid]}
        ]
    };

    try {
        if (!myDevice) {
            msg('Requesting device...');
            const device = await navigator.bluetooth.requestDevice(options);
            myDevice = device;
            document.getElementById('devname').innerHTML = device.name;
            document.getElementById('devid').innerHTML = device.id;
        }

        myDevice.addEventListener('gattserverdisconnected', onDisconnected);

        msg('Connecting to device...');
        const server = await myDevice.gatt.connect();
        document.getElementById('devconnected').innerHTML = 'Yes';

        msg('Getting provisioning service...');
        myService = await server.getPrimaryService(provServiceUuid);
        msg('Connected');
    } catch(error) {
        msg('Connect failed:' + error);
    }
}

function disconnect() {
    if (myDevice) {
        myDevice.gatt.disconnect();
        document.getElementById('devconnected').innerHTML = 'No';
    }
}

function read(uuid, input) {
    if (!myService) {
        return;
    }
    myService.getCharacteristic(uuid)
    .then(characteristic => {
        return characteristic.readValue();
    })
    .then(value => {
        const decoder = new TextDecoder('utf-8');
        const readvalue = decoder.decode(value);
        if (input) {
            input.value = readvalue;
        }
    })
    .catch(function(error) {
        msg('read failed!', error);
    });
}

function write(uuid, input) {
    if (!myService) {
        return;
    }

    myService.getCharacteristic(uuid)
    .then(characteristic => {
        const newval = input.value;
        const encoder = new TextEncoder('utf-8');
        return characteristic.writeValue(encoder.encode(newval));
    })
    .catch(function(error) {
        msg('write failed!', error);
    });
}

function readWifiSsid() {
    read(wifiSsidUuid, document.getElementById('wifissid'));
}

function writeWifiSsid() {
    write(wifiSsidUuid, document.getElementById('wifissid'));
}

function readWifiPassword() {
    read(wifiPasswordUuid, document.getElementById('wifipassword'));
}

function writeWifiPassword() {
    write(wifiPasswordUuid, document.getElementById('wifipassword'));
}

function readGoliothPskId() {
    read(goliothPskIdUuid, document.getElementById('goliothpskid'));
}

function writeGoliothPskId() {
    write(goliothPskIdUuid, document.getElementById('goliothpskid'));
}

function readGoliothPsk() {
    read(goliothPskUuid, document.getElementById('goliothpsk'));
}

function writeGoliothPsk() {
    write(goliothPskUuid, document.getElementById('goliothpsk'));
}
