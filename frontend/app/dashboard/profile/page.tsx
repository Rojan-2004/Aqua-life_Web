"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
    handleUpdateUserProfile,
    handleUpdateUserPassword,
    handleUploadProfilePicture
} from "@/lib/actions/auth-action";

export default function ProfilePage() {
    const { user, loading, updateUser, refreshUser } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [mounted, setMounted] = useState(false);

    // Profile Details State
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    
    // Status States
    const [profileError, setProfileError] = useState("");
    const [profileSuccess, setProfileSuccess] = useState("");
    const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);

    // Image Upload States
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [uploadSuccess, setUploadSuccess] = useState("");

    // Password States
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

    // Sync state with user context data once loaded
    useEffect(() => {
        setMounted(true);
        if (user) {
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            setUsername(user.username || "");
            setPhoneNumber(user.phoneNumber || "");
        }
    }, [user]);

    // Handle initial loading
    if (loading || !mounted) {
        return (
            <div style={{ background: "#0a0e1a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', sans-serif" }}>
                <p style={{ color: "#4dd9e8", fontSize: 18, fontWeight: 600 }}>Loading profile...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{ background: "#0a0e1a", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', sans-serif", padding: 24 }}>
                <h1 style={{ color: "#ff6b6b", marginBottom: 16 }}>Access Denied</h1>
                <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 24 }}>You must be logged in to view this page.</p>
                <Link href="/frontend/login" style={{ padding: "12px 24px", background: "linear-gradient(135deg, #2d9cdb, #4dd9e8)", color: "#fff", textDecoration: "none", borderRadius: 8, fontWeight: 600 }}>Go to Login</Link>
            </div>
        );
    }

    // Handle Profile Form Submit
    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileError("");
        setProfileSuccess("");
        setIsProfileSubmitting(true);

        if (!firstName.trim() || !lastName.trim() || !username.trim()) {
            setProfileError("First Name, Last Name, and Username are required.");
            setIsProfileSubmitting(false);
            return;
        }

        try {
            const result = await handleUpdateUserProfile({
                firstName,
                lastName,
                username,
                phoneNumber
            });

            if (result.success && result.data) {
                updateUser(result.data);
                setProfileSuccess("Profile details updated successfully!");
            } else {
                setProfileError(result.message || "Failed to update profile details.");
            }
        } catch (err: any) {
            setProfileError(err?.message || "An unexpected error occurred.");
        } finally {
            setIsProfileSubmitting(false);
        }
    };

    // Handle Image File Selection
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Simple validation
        if (!file.type.startsWith("image/")) {
            setUploadError("Please select a valid image file (PNG, JPG, JPEG, GIF).");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setUploadError("Image file size must be less than 2MB.");
            return;
        }

        setUploadError("");
        setUploadSuccess("");
        setIsUploading(true);

        const formData = new FormData();
        formData.append("profilePicture", file);

        try {
            const result = await handleUploadProfilePicture(formData);
            if (result.success && result.data) {
                updateUser(result.data);
                setUploadSuccess("Profile picture uploaded successfully!");
                // Clear input
                if (fileInputRef.current) fileInputRef.current.value = "";
            } else {
                setUploadError(result.message || "Failed to upload image.");
            }
        } catch (err: any) {
            setUploadError(err?.message || "Failed to upload image.");
        } finally {
            setIsUploading(false);
        }
    };

    // Handle Password Change
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");
        setIsPasswordSubmitting(true);

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setPasswordError("All password fields are required.");
            setIsPasswordSubmitting(false);
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError("New password must be at least 6 characters long.");
            setIsPasswordSubmitting(false);
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setPasswordError("New password and confirm password do not match.");
            setIsPasswordSubmitting(false);
            return;
        }

        try {
            const result = await handleUpdateUserPassword({
                currentPassword,
                newPassword
            });

            if (result.success) {
                setPasswordSuccess("Password updated successfully!");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
            } else {
                setPasswordError(result.message || "Failed to change password.");
            }
        } catch (err: any) {
            setPasswordError(err?.message || "An unexpected error occurred.");
        } finally {
            setIsPasswordSubmitting(false);
        }
    };

    // Determine avatar display
    const userInitials = `${(firstName || "").charAt(0) || (user?.firstName || "").charAt(0) || ""}${(lastName || "").charAt(0) || (user?.lastName || "").charAt(0) || ""}`.toUpperCase();
    const hasProfilePic = user.profilePicture && user.profilePicture !== "default-profile.png";
    const profilePicUrl = hasProfilePic ? `/profile_pictures/${user.profilePicture}` : null;

    return (
        <main style={{ fontFamily: "'Outfit', sans-serif", background: "#0a0e1a", minHeight: "100vh", padding: "40px 20px" }}>
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
            
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
                {/* Navigation Header */}
                <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                    <div>
                        <Link href="/dashboard" style={{ color: "#4dd9e8", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, transition: "0.2s hover" }}>
                            ← Back to Dashboard
                        </Link>
                        <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 700, marginTop: 8 }}>Profile Settings</h1>
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                        Role: <span style={{ color: "#4dd9e8", textTransform: "uppercase", fontWeight: 700 }}>{user.role}</span>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr", gap: 24 }}>
                    {/* Left Column: Avatar Card */}
                    <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 32, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", alignSelf: "start" }}>
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            style={{ 
                                width: 140, 
                                height: 140, 
                                borderRadius: "50%", 
                                background: "linear-gradient(135deg, rgba(45,156,219,0.1), rgba(77,217,232,0.1))", 
                                border: "3px solid #2d9cdb", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                cursor: "pointer", 
                                overflow: "hidden", 
                                position: "relative",
                                marginBottom: 20,
                                boxShadow: "0 8px 24px rgba(45,156,219,0.2)"
                            }}
                        >
                            {profilePicUrl ? (
                                <img src={profilePicUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <span style={{ fontSize: 44, fontWeight: 700, color: "#4dd9e8", letterSpacing: 1 }}>{userInitials || "?"}</span>
                            )}
                            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(10,14,26,0.75)", padding: "4px 0", color: "#4dd9e8", fontSize: 10, fontWeight: 600 }}>
                                {isUploading ? "Uploading..." : "EDIT"}
                            </div>
                        </div>

                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*"
                            style={{ display: "none" }} 
                        />

                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            style={{ padding: "8px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
                        >
                            Change Picture
                        </button>

                        {uploadError && <p style={{ color: "#ff6b6b", fontSize: 12, marginTop: 12 }}>{uploadError}</p>}
                        {uploadSuccess && <p style={{ color: "#2ecc71", fontSize: 12, marginTop: 12 }}>{uploadSuccess}</p>}

                        <div style={{ marginTop: 28, width: "100%", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24 }}>
                            <p style={{ color: "#fff", fontSize: 18, fontWeight: 600 }}>{firstName} {lastName}</p>
                            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 4 }}>@{username}</p>
                            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 4 }}>{user.email}</p>
                        </div>
                    </div>

                    {/* Right Column: Profile Detail + Change Password */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        {/* Profile Info Form */}
                        <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 32 }}>
                            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Account Details</h2>

                            <form onSubmit={handleProfileSubmit}>
                                {profileError && <div style={{ marginBottom: 16, padding: "10px 12px", background: "rgba(255,0,0,0.1)", border: "1px solid rgba(255,0,0,0.3)", borderRadius: 6, color: "#ff6b6b", fontSize: 13 }}>{profileError}</div>}
                                {profileSuccess && <div style={{ marginBottom: 16, padding: "10px 12px", background: "rgba(46,204,113,0.1)", border: "1px solid rgba(46,204,113,0.3)", borderRadius: 6, color: "#2ecc71", fontSize: 13 }}>{profileSuccess}</div>}

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                                    <div>
                                        <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>First Name</label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            style={{ display: "block", width: "100%", padding: "11px 14px", marginTop: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit" }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Last Name</label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            style={{ display: "block", width: "100%", padding: "11px 14px", marginTop: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit" }}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Username</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        style={{ display: "block", width: "100%", padding: "11px 14px", marginTop: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit" }}
                                    />
                                </div>

                                <div style={{ marginBottom: 24 }}>
                                    <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Phone Number</label>
                                    <input
                                        type="text"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="+1 (555) 000-0000"
                                        style={{ display: "block", width: "100%", padding: "11px 14px", marginTop: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit" }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isProfileSubmitting}
                                    style={{ padding: "12px 24px", background: "linear-gradient(135deg, #2d9cdb, #4dd9e8)", border: "none", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "inherit", cursor: isProfileSubmitting ? "not-allowed" : "pointer", opacity: isProfileSubmitting ? 0.7 : 1 }}
                                >
                                    {isProfileSubmitting ? "Saving Changes..." : "Save Details"}
                                </button>
                            </form>
                        </div>

                        {/* Password Change Form */}
                        <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 32 }}>
                            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Security Settings</h2>

                            <form onSubmit={handlePasswordSubmit}>
                                {passwordError && <div style={{ marginBottom: 16, padding: "10px 12px", background: "rgba(255,0,0,0.1)", border: "1px solid rgba(255,0,0,0.3)", borderRadius: 6, color: "#ff6b6b", fontSize: 13 }}>{passwordError}</div>}
                                {passwordSuccess && <div style={{ marginBottom: 16, padding: "10px 12px", background: "rgba(46,204,113,0.1)", border: "1px solid rgba(46,204,113,0.3)", borderRadius: 6, color: "#2ecc71", fontSize: 13 }}>{passwordSuccess}</div>}

                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Current Password</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="••••••••"
                                        style={{ display: "block", width: "100%", padding: "11px 14px", marginTop: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit" }}
                                    />
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                                    <div>
                                        <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>New Password</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                            style={{ display: "block", width: "100%", padding: "11px 14px", marginTop: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit" }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={confirmNewPassword}
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                            style={{ display: "block", width: "100%", padding: "11px 14px", marginTop: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit" }}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isPasswordSubmitting}
                                    style={{ padding: "12px 24px", background: "linear-gradient(135deg, #2d9cdb, #4dd9e8)", border: "none", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "inherit", cursor: isPasswordSubmitting ? "not-allowed" : "pointer", opacity: isPasswordSubmitting ? 0.7 : 1 }}
                                >
                                    {isPasswordSubmitting ? "Updating Password..." : "Update Password"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
