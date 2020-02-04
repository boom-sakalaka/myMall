<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
        <span>shop</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods()">Price <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short"></use>
            </svg></a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show': filerBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" @click="chenckAllPrice" :class="{'cur':priceChecked=='all'}">All</a></dd>
              <dd v-for="(item,index) in priceFilter" :key="index">
                <a href="javascript:void(0)" @click="chenckPrice(index)" :class="{'cur': priceChecked==index}">{{item.StartPrice}} - {{item.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,index) in goodsList" :key="index">
                  <div class="pic">
                    <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
              <img src="../assets/loading-spinning-bubbles.svg" v-if="loading">
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
    <Modal :mdShow="mdShow" @close="closeModal">
      <p slot="message">
        请先登录，否则无法加入到购物车中！
      </p>
      <div slot="btnGroup">
          <a href="javascript:;" class="btn btn--m" @click="mdShow = false">关闭</a>
      </div>
    </Modal>
    <Modal :mdShow="mdShowCart" @close="closeModal">
      <p slot="message">
         <svg class="icon-status-ok">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
          </svg>
          <span>加入购物车成功</span>
      </p>
      <div slot="btnGroup">
          <a href="javascript:;" class="btn btn--m" @click="mdShowCart = false">继续购物</a>
          <router-link href="javascript:;" class="btn btn--m" to="/cart">
            查看购物车
          </router-link>
      </div>
    </Modal>
  </div>
</template>

<script>
  import '@/assets/css/base.css'
  import '@/assets/css/login.css'
  import '@/assets/css/product.css'
  import NavHeader from '@/components/NavHeader'
  import NavFooter from '@/components/NavFooter'
  import NavBread from '@/components/NavBread'
  import Modal from '@/components/Modal'
  import axios from 'axios'
  export default {
    name: 'GoodsList',
    data() {
      return {
        goodsList: [],
        priceFilter:[
            {
                StartPrice: '0.00',
                endPrice: '100.00'
            },
            {
                StartPrice: '100.00',
                endPrice: '500.00'
            },
            {
                StartPrice: '500.00',
                endPrice: '1000.00'
            },
            {
                StartPrice: '1000.00',
                endPrice: '5000.00'
            }
        ],
        priceChecked: 'all',
        filerBy: false,
        overLayFlag: false,
        sortFlag:true,
        page:1,
        pageSize: 8,
        busy: true,
        loading: false,
        mdShow: false,
        mdShowCart: false
      }
    },
    components:{
        NavHeader,
        NavFooter,
        NavBread,
        Modal
    },
    mounted: function () {
        this.getGoodsList();
    },
    methods: {
        getGoodsList(flag) {
            this.loading = true;
            let params = {
              page: this.page,
              pageSize: this.pageSize,
              sort: this.sortFlag?1:-1,
              priceLevel: this.priceChecked
            }
            axios.get('/goods/list',{params}).then((result) => {
               this.loading = false;
              let res = result.data;
              if(res.status == '0'){
                  if(flag){
                    this.goodsList = this.goodsList.concat(res.result.list);

                    if(res.result.count == 0){
                      this.busy = true;
                    }else{
                      this.busy = false;
                    }
                  }else{
                    this.goodsList = res.result.list;
                     this.busy = false;
                  }
              }else{
                  this.goodsList = [];
              }
               
            })
        },
        chenckPrice(index){
            this.priceChecked =index;
            this.page = 1;
            this.filerBy = false;
            this.getGoodsList();
        },
        chenckAllPrice(){
            this.priceChecked = 'all';
            this.page = 1;
            this.filerBy = false;
            this.getGoodsList()
        },
        showFilterPop(){
            this.filerBy = true;
        },
        sortGoods(){
          this.page = 1;
          this.sortFlag = !this.sortFlag;
          this.getGoodsList();
        },
        loadMore(){
           this.busy = true;
           setTimeout(() => {
              this.page++;
              this.getGoodsList(true)
            }, 1000);
        },
        addCart(productId){
          axios.post('/goods/addCart',{productId}).then((res) => {
            if(res.data.status == 0){
              this.mdShowCart = true;
            }else{
              this.mdShow = true;
            }
          })
        },
        closeModal(){
          this.mdShow = false;
          this.mdShowCart = false;
        }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .btn:hover{
   background-color: #ffe5e6;
   transition: all .3s ease-out;
 }
</style>
