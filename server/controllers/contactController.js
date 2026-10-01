import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Contact from "../models/Contact.js";

// @desc    Submit a new contact message (Contact Us form)
// @route   POST /api/contacts
// @access  Public
export const submitContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !name.trim()) {
    throw new ApiError(400, "Name is required");
  }
  if (!email || !email.trim()) {
    throw new ApiError(400, "Email is required");
  }
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email.trim())) {
    throw new ApiError(400, "Please provide a valid email address");
  }
  if (!subject || !subject.trim()) {
    throw new ApiError(400, "Subject is required");
  }
  if (!message || !message.trim()) {
    throw new ApiError(400, "Message is required");
  }

  const contact = await Contact.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone ? phone.trim() : "",
    subject: subject.trim(),
    message: message.trim(),
  });

  res.status(201).json({
    success: true,
    message: "Thank you for reaching out! Your message has been sent successfully. We will get back to you shortly.",
    data: contact,
  });
});

// @desc    Get all contact messages (with optional filtering and search)
// @route   GET /api/contacts
// @access  Private/Admin
export const getContactMessages = asyncHandler(async (req, res) => {
  const { status, search } = req.query;

  const query = {};
  if (status && ["New", "Read", "Replied"].includes(status)) {
    query.status = status;
  }
  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");
    query.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { subject: searchRegex },
      { message: searchRegex },
    ];
  }

  const contacts = await Contact.find(query).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: contacts.length,
    data: contacts,
  });
});

// @desc    Get single contact message by ID
// @route   GET /api/contacts/:id
// @access  Private/Admin
export const getContactMessageById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    throw new ApiError(404, "Contact message not found");
  }

  res.json({
    success: true,
    data: contact,
  });
});

// @desc    Update contact message status
// @route   PUT /api/contacts/:id/status
// @access  Private/Admin
export const updateContactStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status || !["New", "Read", "Replied"].includes(status)) {
    throw new ApiError(400, "Invalid status. Must be New, Read, or Replied");
  }

  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    throw new ApiError(404, "Contact message not found");
  }

  contact.status = status;
  const updatedContact = await contact.save();

  res.json({
    success: true,
    message: "Contact message status updated",
    data: updatedContact,
  });
});

// @desc    Delete a contact message
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
export const deleteContactMessage = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    throw new ApiError(404, "Contact message not found");
  }

  await contact.deleteOne();

  res.json({
    success: true,
    message: "Contact message deleted successfully",
  });
});
