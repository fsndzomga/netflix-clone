import React, { useState, useEffect } from 'react'
import './PlansScreen.css'
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc, addDoc, onSnapshot  } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { loadStripe } from '@stripe/stripe-js';


function PlansScreen() {

  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser)
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    const getSubscriptions = async () => {
        const customerCollection = collection(db, 'customers', user.uid, 'subscriptions');
        const subscriptionSnapshot = await getDocs(customerCollection);
        subscriptionSnapshot.forEach((subscription) => {
            setSubscription({
                role: subscription.data().role,
                current_period_end: subscription.data().current_period_end.seconds,
            })
        });
    }

    getSubscriptions();
}, [user.uid]);



  useEffect(() => {
    const getProducts = async () => {
      const productsCol = collection(db, 'products');
      const q = query(productsCol, where('active', '==', true));
      const querySnapshot = await getDocs(q);

      const products = {};
      for (const productDoc of querySnapshot.docs) {
        const productData = productDoc.data();
        products[productDoc.id] = productData;

        const priceSnap = await getDocs(collection(doc(db, 'products', productDoc.id), 'prices'));
        priceSnap.docs.forEach(priceDoc => {
          if (!products[productDoc.id].prices) {
            products[productDoc.id].prices = [];
          }
          products[productDoc.id].prices.push({
            priceId: priceDoc.id,
            priceData: priceDoc.data(),
          });
        });
      }

      setProducts(products);
    };

    getProducts().catch(error => {
      console.error("Error fetching data: ", error);
    });
  }, []);



  console.log(products);
  console.log(subscription);


  const loadCheckout = async (priceId) => {
    let docRef;
    try {
      docRef = await addDoc(collection(db, 'customers', user.uid, 'checkout_sessions'), {
        price: priceId,
        success_url: window.location.href,
        cancel_url: window.location.href,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
      return;
    }

    if (docRef) {
      onSnapshot(docRef, async (snap) => {
        const { error, sessionId } = snap.data();

        if (error) {
          alert(`An error occurred: ${error.message}`);
        }

        if (sessionId) {
          const stripe = await loadStripe("pk_test_51NH36tBuPEpXwOmbcILvlXg5Ixru61RmH9DZNXG9Vvii12fpuXa8YLEwtiOoyWgzR7giweSYXiJItD2TlE5916eu00eNHxDWtN");

          stripe.redirectToCheckout({ sessionId });
        }
      });
    }
  };



  return (
    <div
      className='plansScreen'>

        <br />

        {subscription && <p>Renewal date: {new Date(subscription?.current_period_end * 1000).toLocaleDateString()}</p>}




      {Object.entries(products).map(([productId, productData]) => {
        //add some logic to check if the user subscription is active

        const isCurrentPackage = productData.name?.toLowerCase().includes(subscription?.role);


        return (
          <div key={productId}
            className={`${
            isCurrentPackage && "plansScreen__plan--disabled"
            } plansScreen__plan`}
          >
            <div className="plansScreen__info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>
            <button onClick={() => loadCheckout(productData.prices[0].priceId)}
              >{isCurrentPackage ? 'Current Package' : "Subscribe"}</button>
          </div>
        );
      })}
    </div>
  )

}



export default PlansScreen
