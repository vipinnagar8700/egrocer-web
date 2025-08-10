import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { IoIosCloseCircle } from 'react-icons/io';
import { useStripe, useElements, PaymentElement, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import { t } from '@/utils/translation';
import * as api from '@/api/apiRoutes'
import { addUserBalance } from '@/redux/slices/userSlice';
import { useRouter } from 'next/router';

const CARD_OPTIONS = {
    iconStyle: "solid",
    style: {
        base: {
            // iconColor: "#c4f0ff",
            fontWeight: 500,
            fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
            fontSize: "16px",
            fontSmoothing: "antialiased",
            ":-webkit-autofill": { color: "#fce883" },
            "::placeholder": { color: "#87bbfd" },
            // border: "2px solid black"
        },
        invalid: {
            // iconColor: "#ffc7ee",
            color: "#ffc7ee"
        }
    }
};
const CheckoutForm = ({ clientSecret, setShowStripe, amount, transactionId, setWalletModal, stripeOrderId }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state?.User?.user)
    const router = useRouter()

    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false)
    const type = stripeOrderId ? "order" : "wallet"
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        if (!stripe || !elements) {
            console.log("Stripe not loaded yet");
            return;
        }

        try {
            const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: user.name,
                        address: {
                            line1: '510 Townsend St',
                            postal_code: '98140',
                            city: 'San Francisco',
                            state: 'CA',
                            country: 'US',
                        },
                    },
                },
            },);
            if (paymentIntent?.status === 'succeeded') {
                await handleAddPayment()
            } else {
                setShowStripe(false)
                setWalletModal(false)
                const urlOptions = {
                    type: type,
                    status: "failed",
                }
                if (stripeOrderId) {
                    urlOptions.order_id = stripeOrderId
                }
                router.push({ pathname: `/web-payment-status`, query: urlOptions })
            }
        } catch (error) {
            console.log("Error", error)
        }
        setIsLoading(false);
    }



    const handleAddPayment = async () => {
        const orderId = stripeOrderId ? stripeOrderId : null
        try {
            const result = await api.addTransaction({ orderId: orderId, transactionId: transactionId, walletAmount: amount, type: type, paymentMethod: "Stripe" })
            if (type == "wallet") {
                dispatch(addUserBalance({ data: amount }));
                setWalletModal(false)
            }
            setShowStripe(false)
            const urlOptions = {
                type: type,
                status_code: 200,
                status: 'success'
            }
            if (stripeOrderId) {
                urlOptions.order_id = stripeOrderId
            }
            router.push({ pathname: `/web-payment-status`, query: urlOptions })
        } catch (err) {
            console.log("Error: ", err?.message)
        }
    }

    return (
        <form onSubmit={handleOnSubmit} className={"min-h-[150px]  flex flex-col justify-center gap-4 mt-3"}>
            <div className='h-full flex flex-col justify-evenly gap-4'>
                <CardElement options={CARD_OPTIONS} />
            </div>
            <div className="flex justify-center">
                <button
                    className={"text-white text-base font-bold px-4 py-2 mt-4 primaryBackColor rounded-sm"}
                    disabled={!stripe || isLoading}>
                    {isLoading ? t("loading") : t("submit")}
                </button>
            </div>
        </form>
    )

}

const InjectedCheckoutForm = ({ clientSecret, transactionId, setShowStripe, amount, setWalletModal, stripeOrderId }) => {
    return (
        <ElementsConsumer>
            {({ elements, stripe }) => (
                <CheckoutForm
                    elements={elements}
                    stripe={stripe}
                    clientSecret={clientSecret}
                    transactionId={transactionId}
                    setShowStripe={setShowStripe}
                    amount={amount}
                    setWalletModal={setWalletModal}
                    stripeOrderId={stripeOrderId}
                />
            )}
        </ElementsConsumer>
    );
};

const StripeModal = ({ showStripe, setShowStripe, clientSecret, stripeTransId, amount, setWalletModal, stripeOrderId }) => {

    const setting = useSelector(state => state.Setting)

    const stripePromise = loadStripe(setting?.payment_setting && setting?.payment_setting?.stripe_publishable_key)


    return (
        <Dialog open={showStripe} className="bg-gray-400">
            <DialogContent className="max-w-[600px]">
                <DialogHeader >
                    <div className="flex flex-row justify-between items-center">
                        <p className='text-2xl font-bold'>{t("stripe")}</p>
                        <div>
                            <IoIosCloseCircle size={32} onClick={() => setShowStripe(false)} />
                        </div>
                    </div>
                </DialogHeader>
                <div>
                    <Elements stripe={stripePromise} options={CARD_OPTIONS} clientSecret={clientSecret} transactionId={stripeTransId}>
                        <InjectedCheckoutForm
                            setShowStripe={setShowStripe}
                            stripe={stripePromise}
                            options={CARD_OPTIONS}
                            clientSecret={clientSecret}
                            transactionId={stripeTransId}
                            amount={amount}
                            setWalletModal={setWalletModal}
                            stripeOrderId={stripeOrderId}
                        />
                    </Elements>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default StripeModal