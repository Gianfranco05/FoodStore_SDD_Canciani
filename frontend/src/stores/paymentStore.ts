import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PaymentState {
  paymentStatus: 'pending' | 'approved' | 'rejected' | null
  preferenceId: string | null
  setPaymentStatus: (status: 'pending' | 'approved' | 'rejected' | null) => void
  setPreferenceId: (id: string | null) => void
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set) => ({
      paymentStatus: null,
      preferenceId: null,
      setPaymentStatus: (paymentStatus) => set({ paymentStatus }),
      setPreferenceId: (preferenceId) => set({ preferenceId }),
    }),
    {
      name: 'payment-storage',
    }
  )
)