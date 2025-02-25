const  Appointment  = require('../models/Appointment');
const  User=require("../models/User")

// Create an appointment request
exports.createAppointment = async (req, res) => {
    try {
        const { requestedDate } = req.body;
        const userId = req.user.id; // Assuming authentication middleware adds user info

        const appointment = await Appointment.create({ userId, requestedDate });

        res.status(201).json({ success: true, message: "Appointment request submitted.", appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all appointments (Admin Only)
exports.getAllAppointments = async (req, res) => {
    try {
        // Fetch all appointments
        const appointments = await Appointment.findAll();

        // Manually fetch user for each appointment
        const appointmentsWithUser = [];
        for (let appointment of appointments) {
            const user = await User.findByPk(appointment.userId); // Find user by userId
            appointmentsWithUser.push({
                ...appointment.toJSON(),
                user: user ? user.toJSON() : null // Attach user to appointment data
            });
        }

        res.status(200).json({ success: true, appointments: appointmentsWithUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Accept or reject an appointment (Admin Only)
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate the status value
        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value." });
        }

        // Fetch the appointment by id
        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found." });
        }

        // Update the appointment status
        appointment.status = status;
        await appointment.save(); // Save the updated status

        res.status(200).json({ success: true, message: `Appointment ${status}.`, appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Get all pending appointments
exports.getPendingAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            where: { status: 'pending' } // Filter by pending status
        });

        // Manually fetch user for each appointment
        const appointmentsWithUser = [];
        for (let appointment of appointments) {
            const user = await User.findByPk(appointment.userId); // Find user by userId
            appointmentsWithUser.push({
                ...appointment.toJSON(),
                user: user ? user.toJSON() : null // Attach user to appointment data
            });
        }

        res.status(200).json({ success: true, appointments: appointmentsWithUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all accepted appointments
exports.getAcceptedAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            where: { status: 'accepted' } // Filter by accepted status
        });

        // Manually fetch user for each appointment
        const appointmentsWithUser = [];
        for (let appointment of appointments) {
            const user = await User.findByPk(appointment.userId); // Find user by userId
            appointmentsWithUser.push({
                ...appointment.toJSON(),
                user: user ? user.toJSON() : null // Attach user to appointment data
            });
        }

        res.status(200).json({ success: true, appointments: appointmentsWithUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all rejected appointments
exports.getRejectedAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            where: { status: 'rejected' } // Filter by rejected status
        });

        // Manually fetch user for each appointment
        const appointmentsWithUser = [];
        for (let appointment of appointments) {
            const user = await User.findByPk(appointment.userId); // Find user by userId
            appointmentsWithUser.push({
                ...appointment.toJSON(),
                user: user ? user.toJSON() : null // Attach user to appointment data
            });
        }

        res.status(200).json({ success: true, appointments: appointmentsWithUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


