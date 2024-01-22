import { PhoneIcon, BellSlashIcon,HomeIcon,  CurrencyDollarIcon, TruckIcon, TagIcon, ShieldCheckIcon, Bars3Icon, ArrowPathIcon } from '@heroicons/react/24/outline';

const App = () => {
  return (
    <div className="p-8 mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-10">
  <h1 className="text-3xl font-bold mb-6">Добро пожаловать в KeyMarket - ваш лучший партнер по недвижимости!</h1>

  <p className="text-lg mb-6">KeyMarket - это ваш надежный гид в мире недвижимости в Узбекистане. Мы специализируемся на продаже и аренде жилья, предоставляя уникальные возможности для наших клиентов.</p>

  <p className="text-lg mb-6">Почему выбирают нас:</p>

  <ul className="list-disc pl-6 mb-6">
    <li className="mb-2 flex items-center"><HomeIcon className="w-5 h-5 mr-2" /> Разнообразие недвижимости от лучших застройщиков и агентств.</li>
    <li className="mb-2 flex items-center"><ShieldCheckIcon className="w-5 h-5 mr-2" /> Гарантированное качество и проверенные варианты от наших партнеров.</li>
    <li className="mb-2 flex items-center"><CurrencyDollarIcon className="w-5 h-5 mr-2" /> Привлекательные цены на квартиры, дома и земельные участки.</li>
    <li className="mb-2 flex items-center"><BellSlashIcon className="w-5 h-5 mr-2" /> Гибкие условия покупки и возможность рассрочки на удобных условиях.</li>
    <li className="mb-2 flex items-center"><TruckIcon className="w-5 h-5 mr-2" /> Безопасная и быстрая доставка документов и ключей по всей территории Узбекистана.</li>
    <li className="mb-2 flex items-center"><TagIcon className="w-5 h-5 mr-2" /> Регулярные акции и скидки на объекты в нашем каталоге.</li>
    <li className="mb-2 flex items-center"><Bars3Icon className="w-5 h-5 mr-2" /> Профессиональное обслуживание и консультации от наших экспертов.</li>
    <li className="mb-2 flex items-center"><ArrowPathIcon className="w-5 h-5 mr-2" /> Услуги обмена и продажи вашей текущей недвижимости.</li>
  </ul>

  <p className="text-lg mb-6">Наши консультанты всегда готовы помочь. Свяжитесь с нами по телефону или в Телеграм, и мы ответим на все ваши вопросы, поможем с выбором и оформлением сделки.</p>

  <p className="text-lg">Сделайте свою жизнь ярче с недвижимостью от KeyMarket!</p>
</div>

  );
}

export default App;
