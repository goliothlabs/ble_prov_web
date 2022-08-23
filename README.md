# ble_prov_web

Minimal provisioning web app for setting WiFi and Golioth credentials
on an embedded device using [Web Bluetooth](https://googlechrome.github.io/samples/web-bluetooth/).

On the device firmware side, it's currently only supported on the ESP32 via the
[esp-idf SDK golioth_basics example](https://github.com/golioth/golioth-esp-idf-sdk/tree/main/examples/golioth_basics).

## Run Locally

```sh
python -m http.server
```
