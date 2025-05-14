import React from 'react';

const PaymentMethod = ({ method }) => (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-base font-semibold text-gray-700 mb-2">Phương thức thanh toán</h2>
        <div className="flex items-center gap-2">
            <img src="https://s3-sgn09.fptcloud.com/ict-payment-icon/payment/cod.png" alt="COD" className="w-6 h-6" />
            <p className="text-sm text-gray-800">{method}</p>
        </div>
    </div>
);

export default PaymentMethod;
