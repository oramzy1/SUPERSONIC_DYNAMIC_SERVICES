import { useState, useEffect } from "react";
import { accountApi, quotesApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { showError, showErrorText, showSuccess } from "@/lib/toast";

export function useProfileSettings() {
  const { user, refreshUser } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name ?? "");
      setPhone(user.phone ?? "");
      setAvatarUrl(user.profile_image_url ?? "");
    }
  }, [user]);

  const handleAvatarFile = async (file: File) => {
    setUploadingAvatar(true);
    try {
      // Reusing the generic presigned-url endpoint - it's tagged "Quotes" in
      // the OpenAPI spec but is a plain S3-presign utility with no
      // quote-specific logic, and there's no dedicated avatar upload route.
      const presigned = await quotesApi.getPresignedUrl(file.name, file.type || "image/jpeg");
      const putRes = await fetch(presigned.url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "image/jpeg" },
      });
      if (!putRes.ok) throw new Error(`Upload failed with status ${putRes.status}`);
      setAvatarUrl(presigned.url.split("?")[0]);
    } catch (err) {
      showError(err, "Failed to upload photo. Please try again.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const saveProfile = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSavingProfile(true);
    try {
      await accountApi.updateProfile({
        full_name: fullName || undefined,
        phone: phone || undefined,
        profile_image_url: avatarUrl || undefined,
      });
      // Re-fetching into AuthContext is what makes this "global": every
      // screen reads user from useAuth(), so this one call propagates the
      // change everywhere (headers, avatars, greetings) without a reload.
      await refreshUser();
      showSuccess("Profile updated.");
    } catch (err) {
      showError(err, "Failed to update profile. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const savePassword = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!currentPassword) {
      showErrorText("Enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      showErrorText("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showErrorText("New passwords don't match.");
      return;
    }
    setSavingPassword(true);
    try {
      await accountApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showSuccess("Password changed.");
    } catch (err) {
      showError(err, "Failed to change password. Please try again.");
    } finally {
      setSavingPassword(false);
    }
  };

  return {
    user,
    fullName,
    setFullName,
    phone,
    setPhone,
    avatarUrl,
    uploadingAvatar,
    handleAvatarFile,
    savingProfile,
    saveProfile,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    savingPassword,
    savePassword,
  };
}
