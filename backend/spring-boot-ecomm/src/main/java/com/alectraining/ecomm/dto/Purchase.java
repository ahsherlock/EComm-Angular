package com.alectraining.ecomm.dto;

import com.alectraining.ecomm.entity.Address;
import com.alectraining.ecomm.entity.Customer;
import com.alectraining.ecomm.entity.Order;
import com.alectraining.ecomm.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem>orderItems;

}
