# Simple micro:bit Web App Controller
Simple Web App for controlling micro:bit using BLE (Bluetooth Low Energy) compatible with Nordic UART.

## How to create code in MakeCode
Simply read commands separated by `#`. Commands are simple:
* `f` - forward
* `b` - backward
* `l` - left
* `r` - right

### Code example

```js
// ------- INIT --------
// variable for storing data
let Data = ""

// dellimiter is '#'
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.Hash), function () {
    Data = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Hash))
})

// connection status
bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.Happy)
})

bluetooth.onBluetoothDisconnected(function () {
    basic.showIcon(IconNames.No)
})

// start the service
bluetooth.startUartService()

// ------- COMMANDS --------
basic.forever(function () {
    if (Data == "f") {
        // forward
    } else if (Data == "b") {
        // backward
    } else if (Data == "l") {
        // right
    } else if (Data == "r") {
        // left
    } else {
        // released
    }
})
```

## How to connect
Open the Web App on your phone's browser (for iOS use Chrome).

1. Click the `Connect` button.
2. Select your micro:bit device (usually in format `BBC micro:bit [xxxxx]`).
3. Click `Pair`.
4. Use D-Pad to send commands.