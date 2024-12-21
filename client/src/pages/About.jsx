import React from "react";

const About = () => {
  return (
    <div>
      <div className="bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="bg-teal-600 text-white py-12 px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-lg">
            Welcome to our e-commerce platform! We strive to provide the best
            shopping experience.
          </p>
        </div>

        {/* Mission Section */}
        <div className="max-w-6xl mx-auto py-16 px-6 text-gray-800">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
          <p className="text-lg text-center mb-6">
            Our mission is to connect people with the products they love,
            offering quality, convenience, and reliability.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <img
                src="https://cdn.pixabay.com/photo/2020/06/15/11/47/label-5301486_1280.png"
                alt="Quality Products"
                className="mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
              <p className="text-sm text-gray-600">
                We ensure that all our products meet the highest standards of
                quality and reliability.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <img
                src="https://cdn.pixabay.com/photo/2018/04/18/20/07/delivery-truck-3331471_1280.png"
                alt="Fast Delivery"
                className="mx-auto mb-4 mt-20"
              />
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-600">
                Get your orders delivered quickly with our seamless logistics
                network.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <img
                src="https://cdn.pixabay.com/photo/2024/03/28/19/43/customer-service-8661577_1280.png"
                alt="Customer Support"
                className="mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Customer Support</h3>
              <p className="text-sm text-gray-600">
                Our dedicated team is here to help you with any queries or
                concerns.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        {/* <div className="bg-white py-16 px-6">
          <h2 className="text-3xl font-bold mb-6 text-center">Meet Our Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {["Alice", "Bob", "Charlie", "Diana"].map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={`https://via.placeholder.com/150?text=${member}`}
                  alt={member}
                  className="rounded-full w-32 h-32 mx-auto mb-4"
                />
                <h3 className="text-xl font-medium">{member}</h3>
                <p className="text-sm text-gray-500">Team Member</p>
              </div>
            ))}
          </div>
        </div> */}

        {/* Footer Section */}
        <div className="bg-teal-600 text-white py-12 px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Thank You for Trusting Us!
          </h2>
          <p className="text-lg">
            We are committed to making your shopping experience better every
            day.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
