const SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const RX_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

let myCharacteristic;
const statusDiv = document.getElementById("status");

document.getElementById("connectBtn").addEventListener("click", async () => {
    try {
        statusDiv.innerText = "Status: Scanning...";

        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: [SERVICE_UUID]
        });

        device.addEventListener('gattserverdisconnected', () => {
            statusDiv.innerText = "Status: Disconnected";
        });

        statusDiv.innerText = "Status: Connecting...";
        const server = await device.gatt.connect();

        const service = await server.getPrimaryService(SERVICE_UUID);
        myCharacteristic = await service.getCharacteristic(RX_UUID);

        statusDiv.innerText = "Status: Connected to " + device.name;
    } catch (error) {
        statusDiv.innerText = "Error: " + error.message;
    }
});

async function sendCommand(cmd) {
    if (!myCharacteristic) return;

    const commandString = cmd + "#";
    const encoder = new TextEncoder();
    const data = encoder.encode(commandString);

    try {
        if (myCharacteristic.properties.writeWithoutResponse) {
            await myCharacteristic.writeValueWithoutResponse(data);
        } else {
            await myCharacteristic.writeValue(data);
        }
        console.log("Sent:", commandString);
    } catch (error) {
        console.error("Send error:", error);
    }
}

const buttons = document.querySelectorAll('.dpad-btn');

buttons.forEach(btn => {
    const commandId = btn.getAttribute('data-id');

    const handlePress = (e) => {
        e.preventDefault();
        btn.classList.add('active');
        sendCommand(commandId);
    };

    const handleRelease = (e) => {
        e.preventDefault();
        btn.classList.remove('active');
        sendCommand("s");
    };

    btn.addEventListener('touchstart', handlePress);
    btn.addEventListener('touchend', handleRelease);
    btn.addEventListener('mousedown', handlePress);
    btn.addEventListener('mouseup', handleRelease);
    btn.addEventListener('mouseleave', handleRelease);
});