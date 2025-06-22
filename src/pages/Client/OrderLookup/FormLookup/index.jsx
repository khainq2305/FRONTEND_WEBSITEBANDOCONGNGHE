import React, { useState } from "react";

const FormLookup = ({ onSubmit }) => {
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!phone || !code) return;
        onSubmit(phone, code);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-md p-6 mx-auto max-w-[1280px] flex flex-col md:flex-row items-center md:items-center space-y-6 md:space-y-0 md:space-x-8"
        >

            <div className="w-full md:w-3/5 flex justify-center md:justify-start">
                <img
                    src="https://didongviet.vn/_next/image?url=%2Ficon%2Ftracuu%2Ftracuu.png&w=640&q=75"
                    alt="Shipper giao hàng"
                    className="max-w-[600px] w-full h-auto object-contain mx-10"
                />
            </div>

            {/* Bên phải: form nhập */}
            <div className="w-full md:w-2/5 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại
                    </label>
                    <input
                        type="tel"
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập số điện thoại"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mã đơn hàng
                    </label>
                    <input
                        type="text"
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập mã đơn hàng"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                    />
                </div>
                <div className="pt-2 text-center md:text-left">
                    <button
                        type="submit"
                        className="bg-primary text-white font-semibold px-6 py-2 rounded hover:bg-red-700 transition w-full"
                    >
                        Tra cứu đơn hàng
                    </button>
                </div>
            </div>
        </form>



    );
};

export default FormLookup;
