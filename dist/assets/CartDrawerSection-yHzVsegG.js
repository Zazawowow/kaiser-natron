import{B as e,C as t,G as n,S as r,c as i,ft as a,j as o,m as s,p as c,s as l}from"./runtime-core.esm-bundler-DTXUv7Wx.js";import{t as u}from"./Icon-Dcq1PyHo.js";import{t as d}from"./i18n-BE70RUdV.js";import{a as f,c as p,i as m,l as h,o as g,s as _}from"./api-BkifONga.js";import{t as v}from"./Button-DAQ-3-Uk.js";import{t as y}from"./CartDrawer-BOCuIGNH.js";import{t as b}from"./SectionShell-CU6IpKMJ.js";var x={class:`eyebrow mb-5`},S={class:`rounded-md border border-line bg-paper p-6 flex flex-col sm:flex-row sm:items-center gap-4`},C={class:`text-[13px] text-muted`},w={class:`eyebrow mb-5`},T={class:`text-[15px] text-muted leading-relaxed mb-4 max-w-2xl`},E={class:`eyebrow mb-5`},D={__name:`CartDrawerSection`,setup(D){let{t:O}=d(),k=h(),A=e(!1);async function j(){await f(),await m(`kaiser-natron-pulver-250-g-grosspackung`,2),await m(`kaiser-natron-bad-500-g`,1),A.value=!0}async function M({productId:e,quantity:t}){await p(e,t)}async function N(e){await _(e)}return r(()=>{g()}),(e,r)=>(t(),i(b,{eyebrow:n(O)(`ds.eyebrow.components`),title:n(O)(`ds.cartDrawer.title`),description:n(O)(`ds.cartDrawer.description`)},{default:o(()=>[l(`section`,null,[l(`h2`,x,a(n(O)(`ds.heading.default`)),1),l(`div`,S,[s(v,{variant:`primary`,onClick:j},{before:o(()=>[s(u,{name:`cart`,size:18})]),default:o(()=>[c(` `+a(n(O)(`ds.cartDrawer.demoLabel`)),1)]),_:1}),l(`p`,C,a(n(O)(`ds.cartDrawer.demoHint`)),1)])]),l(`section`,null,[l(`h2`,w,a(n(O)(`ds.cartDrawer.integrationTitle`)),1),l(`p`,T,a(n(O)(`ds.cartDrawer.integrationBody`)),1),r[2]||=l(`div`,{class:`rounded-md border border-line bg-paper p-6 font-mono text-[12px] text-ink`},[l(`pre`,{class:`whitespace-pre-wrap`},`import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '@/api/index.js'

await addToCart('kaiser-natron-pulver-250-g-grosspackung', 1)
await updateCartItem('kaiser-natron-bad-500-g', 3)
await removeFromCart('kaiser-natron-bad-500-g')
const cart = await fetchCart()`)],-1)]),l(`section`,null,[l(`h2`,E,a(n(O)(`ds.heading.usage`)),1),r[3]||=l(`div`,{class:`rounded-md border border-line bg-paper p-6 font-mono text-[12px] text-ink`},[l(`pre`,{class:`whitespace-pre-wrap`},`<CartDrawer
  v-model="open"
  :items="cart.items"
  :subtotal="cart.subtotal"
  :count="cart.count"
  @update-quantity="onQty"
  @remove="onRemove"
  @checkout="goToCheckout"
/>`)],-1)]),s(y,{modelValue:A.value,"onUpdate:modelValue":r[0]||=e=>A.value=e,items:n(k).items,subtotal:n(k).subtotal,count:n(k).count,onUpdateQuantity:M,onRemove:N,onCheckout:r[1]||=e=>A.value=!1},null,8,[`modelValue`,`items`,`subtotal`,`count`])]),_:1},8,[`eyebrow`,`title`,`description`]))}};export{D as default};