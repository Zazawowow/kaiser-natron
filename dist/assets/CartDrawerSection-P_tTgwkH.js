import{A as e,S as t,W as n,c as r,ct as i,m as a,p as o,s,x as c,z as l}from"./runtime-core.esm-bundler-DgkFZzbt.js";import{t as u}from"./Icon-D1Ud4H_f.js";import{t as d}from"./i18n-BnJyMUMH.js";import{a as f,i as p,n as m,o as h,r as g,t as _}from"./api-4Jnm40kQ.js";import{t as v}from"./Button-CajVMpo0.js";import{t as y}from"./CartDrawer-BmeOZCTu.js";import{t as b}from"./SectionShell-CHsfR9Y3.js";var x={class:`eyebrow mb-5`},S={class:`rounded-md border border-line bg-paper p-6 flex flex-col sm:flex-row sm:items-center gap-4`},C={class:`text-[13px] text-muted`},w={class:`eyebrow mb-5`},T={class:`text-[15px] text-muted leading-relaxed mb-4 max-w-2xl`},E={class:`eyebrow mb-5`},D={__name:`CartDrawerSection`,setup(D){let{t:O}=d(),k=h(),A=l(!1);async function j(){await m(),await _(`kaiser-natron-pulver-250-g-grosspackung`,2),await _(`kaiser-natron-bad-500-g`,1),A.value=!0}async function M({productId:e,quantity:t}){await f(e,t)}async function N(e){await p(e)}return c(()=>{g()}),(c,l)=>(t(),r(b,{eyebrow:n(O)(`ds.eyebrow.components`),title:n(O)(`ds.cartDrawer.title`),description:n(O)(`ds.cartDrawer.description`)},{default:e(()=>[s(`section`,null,[s(`h2`,x,i(n(O)(`ds.heading.default`)),1),s(`div`,S,[a(v,{variant:`primary`,onClick:j},{before:e(()=>[a(u,{name:`cart`,size:18})]),default:e(()=>[o(` `+i(n(O)(`ds.cartDrawer.demoLabel`)),1)]),_:1}),s(`p`,C,i(n(O)(`ds.cartDrawer.demoHint`)),1)])]),s(`section`,null,[s(`h2`,w,i(n(O)(`ds.cartDrawer.integrationTitle`)),1),s(`p`,T,i(n(O)(`ds.cartDrawer.integrationBody`)),1),l[2]||=s(`div`,{class:`rounded-md border border-line bg-paper p-6 font-mono text-[12px] text-ink`},[s(`pre`,{class:`whitespace-pre-wrap`},`import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '@/api/index.js'

await addToCart('kaiser-natron-pulver-250-g-grosspackung', 1)
await updateCartItem('kaiser-natron-bad-500-g', 3)
await removeFromCart('kaiser-natron-bad-500-g')
const cart = await fetchCart()`)],-1)]),s(`section`,null,[s(`h2`,E,i(n(O)(`ds.heading.usage`)),1),l[3]||=s(`div`,{class:`rounded-md border border-line bg-paper p-6 font-mono text-[12px] text-ink`},[s(`pre`,{class:`whitespace-pre-wrap`},`<CartDrawer
  v-model="open"
  :items="cart.items"
  :subtotal="cart.subtotal"
  :count="cart.count"
  @update-quantity="onQty"
  @remove="onRemove"
  @checkout="goToCheckout"
/>`)],-1)]),a(y,{modelValue:A.value,"onUpdate:modelValue":l[0]||=e=>A.value=e,items:n(k).items,subtotal:n(k).subtotal,count:n(k).count,onUpdateQuantity:M,onRemove:N,onCheckout:l[1]||=e=>A.value=!1},null,8,[`modelValue`,`items`,`subtotal`,`count`])]),_:1},8,[`eyebrow`,`title`,`description`]))}};export{D as default};