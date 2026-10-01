"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-hooks";
import { BusinessProfileForm, BusinessProfileFormValues } from "@/components/business-profile/BusinessProfileForm";
import { getBusinessProfile, upsertBusinessProfile } from "@/lib/api/businessProfile";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [initial, setInitial] = useState<Partial<BusinessProfileFormValues> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!isAuthenticated) return;
      setLoading(true);
      setError(null);
      try {
        const profile = await getBusinessProfile();
        if (mounted) {
          if (profile) {
            setInitial({
              businessName: profile.businessName,
              addressLine1: profile.addressLine1,
              addressLine2: profile.addressLine2 || "",
              city: profile.city,
              stateProvince: profile.stateProvince,
              postalCode: profile.postalCode,
              country: profile.country,
              taxId: profile.taxId || "",
              contactEmail: profile.contactEmail,
              contactPhone: profile.contactPhone || "",
            });
          } else {
            setInitial({
              businessName: "",
              addressLine1: "",
              addressLine2: "",
              city: "",
              stateProvince: "",
              postalCode: "",
              country: "",
              taxId: "",
              contactEmail: "",
              contactPhone: "",
            });
          }
        }
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Failed to load profile');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

  async function handleSubmit(values: BusinessProfileFormValues) {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await upsertBusinessProfile(values as any);
      setSuccess('Profile saved successfully');
    } catch (e: any) {
      setError(e?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  if (!isAuthenticated && !isLoading) return null;

  return (
    <div className="p-4 sm:p-6">
      {loading ? (
        <div>Loading profile...</div>
      ) : (
        <BusinessProfileForm
          initialValues={initial || undefined}
          onSubmit={handleSubmit}
          submitting={saving}
          serverError={error}
          serverSuccess={success}
        />
      )}
    </div>
  );
}
