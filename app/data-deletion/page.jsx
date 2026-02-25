import React from "react";

export const metadata = {
  title: "Data Deletion Policy | Sparky",
  description:
    "Learn how to request deletion of your personal data from Sparky.",
};

export default function DataDeletion() {
  return (
    <main
      style={{
        maxWidth: "800px",
        margin: "60px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.7",
        color: "#333",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>Data Deletion Policy</h1>

      <p>
        At <strong>Sparky</strong>, we respect your privacy and your right to
        control your personal information. This page explains how you can
        request deletion of your data from our systems.
      </p>

      <h2 style={{ marginTop: "30px" }}>Information We May Store</h2>
      <p>Depending on your usage of our services, we may store:</p>
      <ul>
        <li>Your phone number</li>
        <li>Your name (if provided)</li>
        <li>Authentication/OTP verification logs</li>
      </ul>

      <h2 style={{ marginTop: "30px" }}>How to Request Data Deletion</h2>
      <p>
        If you would like to delete your account and associated data, please
        send an email to:
      </p>

      <p>
        <strong>Email: </strong>
        <a href="mailto:tarunpreet744@gmail.com">
          tarunpreet744@gmail.com
        </a>
      </p>

      <p>Please include the following details in your request:</p>
      <ul>
        <li>Your registered phone number</li>
        <li>Your full name</li>
        <li>Subject line: “Data Deletion Request”</li>
      </ul>

      <h2 style={{ marginTop: "30px" }}>Processing Time</h2>
      <p>
        We will review and process your request within <strong>7 working days</strong>.
        Once completed, all associated personal data will be permanently deleted
        from our active systems.
      </p>

      <h2 style={{ marginTop: "30px" }}>Contact</h2>
      <p>
        If you have any questions regarding this policy, please contact us at
        the email address provided above.
      </p>

      <p style={{ marginTop: "40px", fontSize: "14px", color: "#666" }}>
        Last Updated: {new Date().getFullYear()}
      </p>
    </main>
  );
}