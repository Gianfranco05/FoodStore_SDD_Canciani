import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PaymentStatus = 'pending' | 'approved' | 'rejected' | null

interface PaymentState {
  /** Estado del último pago */
  paymentStatus: PaymentStatus
  /** ID de preferencia de MercadoPago */
  preferenceId: string | null
  /** init_point para redirección a MP */
  initPoint: string | null
  /** loading state */
  loading: boolean
  /** error message */
  error: string | null

  // Actions
  setPaymentStatus: (status: PaymentStatus) => void
  setPreferenceId: (id: string | null) => void
  setInitPoint: (url: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set) => ({
      paymentStatus: null,
      preferenceId: null,
      initPoint: null,
      loading: false,
      error: null,

      setPaymentStatus: (paymentStatus) => set({ paymentStatus }),
      setPreferenceId: (preferenceId) => set({ preferenceId }),
      setInitPoint: (initPoint) => set({ initPoint }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      reset: () => set({
        paymentStatus: null,
        preferenceId: null,
        initPoint: null,
        loading: false,
        error: null,
      }),
    }),
    {
      name: 'payment-storage',
      // Solo persistir status y preferenceId (no loading/error)
      partialize: (state) => ({
        paymentStatus: state.paymentStatus,
        preferenceId: state.preferenceId,
        initPoint: state.initPoint,
      }),
    }
  )
)
