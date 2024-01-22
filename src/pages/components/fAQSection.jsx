import { Disclosure } from '@headlessui/react';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

const faqs = [
  {
    question: 'Какие варианты оплаты доступны при покупке недвижимости?',
    answer: 'Мы предлагаем гибкие условия оплаты, включая возможность рассрочки и ипотечного кредитования. Свяжитесь с нашими консультантами для получения подробной информации о вариантах оплаты, соответствующих вашим потребностям.',
  },
  {
    question: 'Как долго занимает процесс оформления сделки на покупку недвижимости?',
    answer: 'Время оформления сделки может варьироваться в зависимости от конкретной ситуации и типа сделки. Мы стремимся сделать этот процесс максимально быстрым и удобным для наших клиентов. Свяжитесь с нашим отделом продаж для получения консультации.',
  },
  {
    question: 'Есть ли у вас специальные предложения или акции для покупателей недвижимости?',
    answer: 'Да, мы регулярно предлагаем специальные предложения и акции для наших клиентов. Следите за нашими новостями и обновлениями, чтобы быть в курсе текущих предложений и выгодных сделок.',
  },
  {
    question: 'Предоставляется ли юридическая поддержка при покупке недвижимости через вас?',
    answer: 'Да, мы предоставляем профессиональную юридическую поддержку в процессе сделки. Наши юристы гарантируют, что весь процесс соответствует законодательству и защищает ваши интересы.',
  },
  {
    question: 'Могу ли я обменять свою текущую недвижимость на объект, представленный в вашем каталоге?',
    answer: 'Да, мы предлагаем услугу Trade-in, которая позволяет вам обменять вашу текущую недвижимость на объект из нашего каталога. Свяжитесь с нашим отделом продаж, чтобы узнать подробности и начать процесс обмена.',
  },
  // Добавьте еще вопросы и ответы по необходимости
];

const FaqSection = () => {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8  lg:py-10">
        <div className="divide-y divide-gray-900/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Часто задаваемые вопросы</h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                        <span className="text-base font-semibold leading-7">{faq.question}</span>
                        <span className="ml-6 flex h-7 items-center">
                          {open ? (
                            <MinusIcon className="h-6 w-6" aria-hidden="true" />
                          ) : (
                            <PlusIcon className="h-6 w-6" aria-hidden="true" />
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
