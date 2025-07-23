import Footer from "./Footer";

const About = () => {
  return (
    <>
      {/* Banner giới thiệu */}
      <div className="w-[98%] mx-auto mt-8 h-[60vh] sm:h-[85vh] rounded-2xl bg-cover bg-center relative overflow-hidden shadow-xl" style={{ backgroundImage: `url(https://pathedits.com/cdn/shop/articles/image16.jpg?v=1604514116)` }}>
        <div className="absolute inset-0 bg-black bg-opacity-60 rounded-2xl flex flex-col justify-center items-center text-white px-4">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4">Về Chúng Tôi</h1>
          <p className="text-lg sm:text-xl max-w-2xl text-center font-medium">
            Chào mừng bạn đến với <span className="text-yellow-400 font-bold">E-Shop</span> — nền tảng thương mại điện tử hiện đại, nơi bạn có thể mua sắm dễ dàng, nhanh chóng và an toàn với hàng ngàn sản phẩm chất lượng!
          </p>
        </div>
      </div>

      {/* Nội dung chi tiết */}
      <div className="w-[90%] mx-auto my-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Hình ảnh minh họa */}
        <div className="w-[98%] mx-auto mt-8 h-[60vh] sm:h-[85vh] rounded-2xl bg-cover bg-center relative overflow-hidden shadow-xl" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1607082349560-49dc02f88b1f?auto=format&fit=crop&w=1740&q=80)` }}></div>

        {/* Thông tin giới thiệu */}
        <div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Sứ Mệnh Của Chúng Tôi</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            E-Shop được thành lập với mục tiêu mang đến cho khách hàng trải nghiệm mua sắm trực tuyến tối ưu. Chúng tôi cung cấp đa dạng các loại mặt hàng từ thời trang, công nghệ, đến đồ gia dụng, với chất lượng đảm bảo và giá cả hợp lý.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            Với giao diện thân thiện, hệ thống thanh toán bảo mật và dịch vụ giao hàng nhanh chóng, chúng tôi không ngừng cải tiến để mang lại sự hài lòng tuyệt đối cho người dùng.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Hơn cả một trang thương mại điện tử, <span className="font-semibold text-yellow-600">E-Shop</span> là người bạn đồng hành đáng tin cậy trong hành trình mua sắm của bạn.
          </p>
        </div>
      </div>

      {/* Giá trị cốt lõi */}
      <div className="w-[90%] mx-auto my-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Giá Trị Cốt Lõi</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
            <h3 className="text-xl font-bold mb-2 text-blue-600">Chất lượng</h3>
            <p className="text-gray-600">Sản phẩm chính hãng, nguồn gốc rõ ràng, cam kết hoàn tiền nếu không hài lòng.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
            <h3 className="text-xl font-bold mb-2 text-green-600">Khách hàng</h3>
            <p className="text-gray-600">Đặt trải nghiệm người dùng làm trung tâm. Hỗ trợ 24/7 mọi lúc, mọi nơi.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
            <h3 className="text-xl font-bold mb-2 text-purple-600">Đổi mới</h3>
            <p className="text-gray-600">Không ngừng phát triển công nghệ để tối ưu hóa quá trình mua sắm và giao dịch.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default About;
