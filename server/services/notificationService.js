const sendWhatsAppNotification = async (phoneNumber, message) => {
    // SIMULATION
    console.log(`[WhatsApp Simulation] Sending to ${phoneNumber}: ${message}`);
    return Promise.resolve(true);
};

module.exports = { sendWhatsAppNotification };
