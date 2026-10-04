import type {Locale,Direction} from '@estara/types';
export const dict:Record<Locale,Record<string,string>>={
 en:{brand:'ESTARA',discover:'Discover',featured:'Featured Properties',locations:'Locations',market:'Market',agents:'Agents',services:'Services',crm:'CRM',search:'Search properties',buy:'Buy',rent:'Rent',commercial:'Commercial',land:'Land',newProject:'New Projects',price:'Price',area:'Area',bedrooms:'Bedrooms',bathrooms:'Bathrooms',favorite:'Favorite',schedule:'Schedule viewing',workingHours:'Working hours',openNow:'Open now',nextOpening:'Next opening',settings:'Settings',save:'Save'},
 fa:{brand:'استارا',discover:'کشف املاک',featured:'املاک ویژه',locations:'موقعیت‌ها',market:'بازار',agents:'مشاوران',services:'خدمات',crm:'مدیریت مشتریان',search:'جستجوی ملک',buy:'خرید',rent:'اجاره',commercial:'تجاری',land:'زمین',newProject:'پروژه‌های جدید',price:'قیمت',area:'متراژ',bedrooms:'اتاق خواب',bathrooms:'حمام',favorite:'مورد علاقه',schedule:'رزرو بازدید',workingHours:'ساعات کاری',openNow:'اکنون باز است',nextOpening:'زمان باز شدن بعدی',settings:'تنظیمات',save:'ذخیره'},
 zh:{brand:'ESTARA',discover:'发现房产',featured:'精选房源',locations:'位置',market:'市场',agents:'经纪人',services:'服务',crm:'客户管理',search:'搜索房产',buy:'购买',rent:'租赁',commercial:'商业地产',land:'土地',newProject:'新项目',price:'价格',area:'面积',bedrooms:'卧室',bathrooms:'卫生间',favorite:'收藏',schedule:'预约看房',workingHours:'营业时间',openNow:'正在营业',nextOpening:'下次开放',settings:'设置',save:'保存'}
};
export function t(locale:Locale,key:string){return dict[locale][key]||dict.en[key]||key}
export function direction(locale:Locale):Direction{return locale==='fa'?'rtl':'ltr'}
export function formatNumber(value:number,locale:Locale){return new Intl.NumberFormat(locale==='fa'?'fa-IR':locale==='zh'?'zh-CN':'en-US').format(value)}
export function formatMoney(value:number,currency:string,locale:Locale){return new Intl.NumberFormat(locale==='fa'?'fa-IR':locale==='zh'?'zh-CN':'en-US',{style:'currency',currency,maximumFractionDigits:0}).format(value)}
