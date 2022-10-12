package com.alectraining.ecomm.service;

import com.alectraining.ecomm.dto.Purchase;
import com.alectraining.ecomm.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
}
