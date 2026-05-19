const SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const RX_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

let myCharacteristic;
const statusDiv = document.getElementById("status");
const consoleDiv = document.getElementById("console");

function logToConsole(message) {
    const time = new Date().toLocaleTimeString();
    const logLine = document.createElement("div");
    logLine.className = "log-entry";
    logLine.innerText = `[${time}] ${message}`;

    consoleDiv.appendChild(logLine);
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

document.getElementById("connectBtn").addEventListener("click", async () => {
    try {
        statusDiv.innerText = "🔵 Status: Scanning...";
        logToConsole("Status: Scanning...")

        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: [SERVICE_UUID]
        });

        device.addEventListener('gattserverdisconnected', () => {
            statusDiv.innerText = "🔴 Status: Disconnected";
            logToConsole("Status: Disconnected...")
        });

        statusDiv.innerText = "🔵 Status: Connecting...";
        const server = await device.gatt.connect();

        const service = await server.getPrimaryService(SERVICE_UUID);
        myCharacteristic = await service.getCharacteristic(RX_UUID);

        statusDiv.innerText = "🟢 Status: Connected to " + device.name;
        logToConsole("Status: Connected...")
    
    } catch (error) {
        statusDiv.innerText = "Error: " + error.message;
        logToConsole("Status: Error: " + error.message)
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
        logToConsole("Sent: " + commandString.trim());
    } catch (error) {
        console.error("Send error:", error);
    }
}

const buttons = document.querySelectorAll('.dpad-btn');

buttons.forEach(btn => {
    const commandPressId = btn.getAttribute('data-id');
    const commandReleaseId = btn.getAttribute('data-release-id');

    const handlePress = (e) => {
        e.preventDefault();
        btn.classList.add('active');
        logToConsole("Press:   '" + commandPressId + "'")
        sendCommand(commandPressId);
    };
    
    const handleRelease = (e) => {
        e.preventDefault();
        btn.classList.remove('active');
        logToConsole("Release: '" + commandReleaseId + "'")
        sendCommand(commandReleaseId);
    };

    btn.addEventListener('touchstart', handlePress);
    btn.addEventListener('touchend', handleRelease);
    btn.addEventListener('mousedown', handlePress);
    btn.addEventListener('mouseup', handleRelease);
    btn.addEventListener('mouseleave', handleRelease);
});

document.getElementById("toggleConsoleBtn").addEventListener("click", () => {
    consoleDiv.classList.toggle("hidden");
});

statusDiv.innerText = "🔴 Status: Disconnected";
logToConsole("Web App is READY!")