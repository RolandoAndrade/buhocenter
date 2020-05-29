<template>
    <div class="container-page" style="position: relative">
    <v-snackbar
            v-model="snackbarfail" top :timeout="timeout" color="error"
        >
            {{$t('ERROR_SAVE_PRODUCT')}}
            <v-btn color="white" text @click="snackbarfail = false">Cerrar</v-btn>
    </v-snackbar>
    <v-snackbar
            v-model="snackbarCatalogues" top :timeout="timeout" color="error"
        >
            {{$t('ERROR_GET_CATALOGUES')}}
            <v-btn color="white" text @click="snackbarCatalogues = false">Cerrar</v-btn>
    </v-snackbar>
    <v-snackbar
            v-model="snackbarSuccessCreated" top :timeout="timeout" color="success"
        >
            {{$t('SUCCESS_SAVE_PRODUCT')}}
            <v-btn color="white" text @click="snackbarSuccessCreated = false">Cerrar</v-btn>
        </v-snackbar>
    <v-snackbar
            v-model="snackbarProducts" top :timeout="timeout" color="error"
        >
            {{$t('ERROR_LOAD_PRODUCTS')}}
            <v-btn color="white" text @click="snackbarProducts = false">Cerrar</v-btn>
        </v-snackbar>
        <v-snackbar
            v-model="snackbarProviders" top :timeout="timeout" color="error"
        >
            {{$t('ERROR_LOAD_PROVIDERS')}}
            <v-btn color="white" text @click="snackbarProviders = false">Cerrar</v-btn>
        </v-snackbar>
        <v-snackbar
            v-model="snackbarCategories" top :timeout="timeout" color="error"
        >
            {{$t('ERROR_LOAD_CATEGORIES')}}
            <v-btn color="white" text @click="snackbarCategories = false">Cerrar</v-btn>
        </v-snackbar>
        <v-snackbar
            v-model="snackbarBrands" top :timeout="timeout" color="error"
        >
            {{$t('ERROR_LOAD_BRANDS')}}
            <v-btn color="white" text @click="snackbarBrands = false">Cerrar</v-btn>
        </v-snackbar>
        <v-snackbar
            v-model="snackbarSuccess" top :timeout="timeout" color="success"
        >
            {{$t('PRODUCT_UPDATED_SUCCESS')}}
            <v-btn color="white" text @click="snackbarSuccess = false">Cerrar</v-btn>
        </v-snackbar>
        <v-snackbar
            v-model="snackbar" top :timeout="timeout" color="success"
        >
            {{$t('PRODUCT_UPDATED_SUCCESS')}}
            <v-btn color="white" text @click="snackbar = false">Cerrar</v-btn>
        </v-snackbar>

        <h2>{{$t('PRODUCTS')}}</h2>
        <template>
            <v-data-table
                    :headers="headers"
                    :items="getProducts"
                    sort-by="calories"
                    class="elevation-1"
            >
                <template v-slot:top>
                    <v-toolbar flat color="white">
                        <v-toolbar-title>{{$t('PRODUCTS')}}</v-toolbar-title>
                        
                        <v-divider
                                class="mx-4"
                                inset
                                vertical                                
                        ></v-divider>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="800px" persistent>
                            <template v-slot:activator="{ on }" >
                                <v-btn color="primary" dark class="mb-2" v-on="on">{{$t('NEW_PRODUCT')}}</v-btn>
                            </template>
                            <v-card lg="36">
                                <v-card-title>
                                    <span class="headline">{{$t('NEW_PRODUCT')}}</span>
                                </v-card-title>
                                <v-card-text>
                                    <v-container>                                
                                        <v-row>
                                            <v-col cols="6" lg="12">
                                                    <v-text-field
                                                        :label="$t('NAME')"
                                                        v-model="name"                        
                                                    ></v-text-field>  
                                            </v-col>
                                            <v-col cols="6" lg="12">
                                                 <v-text-field
                                                        :label="$t('DESCRIPTION')"
                                                        v-model="description"                        
                                                    ></v-text-field>  
                                            </v-col>
                                        </v-row>     
                                        <v-row>
                                            <v-col cols="6" lg="12">
                                                    <v-text-field
                                                        type="number"
                                                        :label="$t('PRICE')"
                                                        v-model="price"                        
                                                    ></v-text-field>  
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="6" lg="12">
                                                <v-text-field
                                                        type="number"
                                                        :label="$t('SHIPPING_PRICE')"
                                                        v-model="shippingPrice"                        
                                                ></v-text-field>  
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="6" lg="12">
                                                    <v-text-field
                                                         type="number"
                                                        :label="$t('QUANTITY_AVAILABLE_PRODUCT')"
                                                        v-model="quantityAvailable"                        
                                                    ></v-text-field>  
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="6" lg="12">
                                                <v-text-field
                                                        type="number"
                                                        :label="$t('MIN_QUANTITY_AVAILABLE_PRODUCTS')"
                                                        v-model="MQA"
                                                ></v-text-field>  
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="6" lg="12">
                                                <v-select
                                                    :items="getBrands"                        
                                                    :label="$t('BRAND')"
                                                    v-model="brandSelected"
                                                    item-text="name"
                                                    item-value="id"
                                                    item-v
                                                    hint="accessibles brands"
                                                    persistent-hint>
                                                </v-select>
                                            </v-col>
                                        </v-row>
                                        <v-container>
                                        <v-row >
                                            <v-col cols="6" lg="12">
                                                <v-select
                                                    :items="getCategories"
                                                    name="category"
                                                    :label="$t('CATEGORIES')"
                                                    v-model="categorieSelected"
                                                    item-text="name"
                                                    item-value="id"
                                                    item-v                                                    
                                                    hint="this is a optional field"
                                                    persistent-hint
                                                    required>                                                  
                                                </v-select>
                                            </v-col>
                                        </v-row>                                    
                                        <v-row>
                                            <v-col cols="6" lg="12">
                                                <v-select
                                                    :items="getProviders"                        
                                                    :label="$t('PROVIDER')"
                                                    v-model="providerSelected"
                                                    item-text="name"
                                                    item-value="id"
                                                    item-v
                                                    multiple
                                                    hint="this is a optional field"
                                                    persistent-hint>
                                                </v-select>                                
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="6" lg="12">
                                                <v-select
                                                    :items="getCatalogues"                        
                                                    :label="$t('CATALOGUES')"
                                                    v-model="catalogueSelected"
                                                    item-text="name"
                                                    item-value="id"
                                                    item-v                                                    
                                                    hint="this is a optional field"
                                                    persistent-hint>
                                                </v-select>                                
                                            </v-col>
                                        </v-row>
                                        </v-container>
                                        <h3>{{$t('ADD_PRODUCT_IMAGE')}}</h3>
                                        <v-row >
                                            
                                            <v-col>
                                            <input 
                                                type="file" 
                                                id="file" 
                                                ref="myFiles" 
                                                class="custom-file-input" 
                                                @change="previewFiles"                                            
                                                lg="12"
                                             >
                                            </v-col>
                                        </v-row>
                                        <v-container v-if="letDimensionMod">
                                        <h3>{{$t('PRODUCT_DIMENSION')}}</h3>
                                        <v-row >                                            
                                            <v-col>
                                                <v-text-field
                                                    type="number"
                                                    :label="$t('PRODUCT_DEPTH')"
                                                    v-model="Z"
                                                    lg="12"                        
                                                ></v-text-field> 
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <v-text-field
                                                    type="number"
                                                    :label="$t('PRODUCT_WIDTH')"
                                                    v-model="X"                        
                                                ></v-text-field> 
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <v-text-field
                                                    type="number"
                                                    :label="$t('PRODUCT_HEIGHT')"
                                                    v-model="Y"                        
                                                ></v-text-field> 
                                            </v-col>
                                        </v-row>                                        
                                        </v-container>

                                        <v-alert type="error" v-if="snackbarErrorCreate">
                                            ¡Name, description, price , shipping price , minumun quantity avalaible, image , dimensions and brand required!
                                        </v-alert>   
                                        <v-alert type="error" v-if="snackbarMoreMinThanAvai">
                                            ¡You can't register less products in inventary than the minimun quantity avalible you choose!
                                        </v-alert> 
                                        <v-alert type="error" v-if="snackbarCataloguesCategories">
                                            ¡You can't register a product in a catalogue without a category!
                                        </v-alert>              

                                    </v-container>
                                    <button class="login100-form-btn" lg="12" v-if="isLoading">
                                    <v-progress-circular
                                        :size="40"
                                        color="white"
                                        indeterminate

                                    ></v-progress-circular>
                            </button>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="close()">{{$t('CANCEL')}}</v-btn>
                                    <v-btn color="blue darken-1" text @click="save(item)">{{$t('SAVE')}}</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        
                    </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon
                            small
                            class="mr-2"
                            @click="editItem(item)"
                    >
                        mdi-pencil
                    </v-icon>
                    <v-icon
                            small
                            @click="deleteItem(item)"
                    >
                        mdi-delete
                    </v-icon>
                </template>
                <template v-slot:no-data>
                    <v-btn color="primary" @click="initialize">{{$t('RESET')}}</v-btn>
                </template>
            </v-data-table>
        </template>
    </div>
</template>
<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { FETCH_BRANDS } from '../../../store/brands/methods/brands.actions';
    import { GET_BRANDS } from '../../../store/brands/methods/brands.getters';
    import { GET_PROVIDERS } from '../../../store/providers/methods/providers.getters';
    import { FETCH_PROVIDERS } from '../../../store/providers/methods/providers.actions';   
    import { 
        UPDATE_PRODUCT, FETCH_ALL_PRODUCTS,
        DELETE_PRODUCT,CREATE_PRODUCT,
        UPLOAD_IMAGE,SAVE_PRODUCT_PHOTOS,
        SAVE_PRODUCT_DIMENSION,SAVE_INVENTORY_QUANTITY,
        UPDATE_INVENTORY_QUANTITY
    } from '../../../store/products/methods/products.actions';
    import { GET_PRODUCTS, GET_PRODUCT_INDEX_ID } from '../../../store/products/methods/products.getters';
    import { brands, providers, categoryModule, products, catalogueModule } from "../../../store/namespaces";
    import { 
        ProductsInterface,dimensionDto, 
        ProductPhotoDto, InventoryProduct,
        CatalogueDto 
    } from '../../products/interfaces/products.interface';
    import CategoriesMethods from '@/store/category-module/methods/category-methods'
    import CatalogueMethods from "@/store/catalogue-module/methods/catalogue-methods";
    @Component
    //recuerda arreglar las categorias
    export default class DashboardProducts extends Vue {
        dialog = false;
        name : string = "";
        description : string= "";
        price :number  = 0;
        shippingPrice : number = 0;
        MQA : number = 0;
        quantityAvailable : number =0;
        brandSelected : number = 0 ;
        providerSelected : number[] = [];
        categorieSelected : number = 0;
        catalogueSelected : number  = 0;
        files: any;
        selectedFiles = null;  
        product:any;
        item:any;
        X: number =0;
        Y: number =0;
        Z: number = 0;

        isLoading : boolean = false ;
                
        snackbarProducts : boolean = false;
        snackbarProviders : boolean = false;
        snackbarCategories : boolean = false;
        snackbarCatalogues : boolean = false;
        snackbarBrands : boolean = false;
        snackbarSuccess : boolean = false;
        snackbarMoreMinThanAvai: boolean = false;
        snackbarCataloguesCategories: boolean= false;

        timeout: number = 5000;               
        snackbar : boolean= false;
        snackbarErrorCreate : boolean = false;
        snackbarSuccessCreated : boolean = false;
        snackbarfail : boolean = false;
        
              
        letMod: boolean = false;       
        letDimensionMod: boolean = true;
        firebaseResponse: boolean= false;
        headers = [
            {
                text: 'Product Name',
                align: 'start',
                sortable: false,
                value: 'name',
            },
            { text: 'Price', value: 'price' },
            { text: 'Shipping Price', value: 'shippingPrice' },
            { text: 'Minimum Quantity Available', value: 'minimumQuantityAvailable' },
            { text: 'Actions', value: 'actions', sortable: false },
        ]
        editedIndex = -1
        editedItem =  {
            id: 0,
        }
        defaultItem = {
            name: '',
            calories: 0,
            fat: 0,
            carbs: 0,
            protein: 0,
        }

        formTitle () {
            if (this.editedIndex ===-1){
                this.letMod = false;
                this.letDimensionMod = true;                
            }else{
                this.letMod = true;
                this.letDimensionMod = false;                
            }
            return this.editedIndex === -1 ? 'New Item [all field must be filled]' : 'Update Product data'

        }

        changeDialog (val) {            
            this.dialog = val
        }

        editItem (item) {      
            this.editedIndex = this.getProducts.indexOf(item);
            console.log(this.editedIndex);
            this.editedItem = Object.assign({}, item)
            this.letDimensionMod=false;
            this.changeDialog(true);
        }

        async deleteItem (item) {            
            this.editedItem = Object.assign({}, item)
            if (confirm('Are you sure you want to delete this item?')){
                this.isLoading = true;                
                this.snackbar = await this.deleteProduct(this.editedItem.id); 
                this.$router.go(0);
            }                                        
        }

        close () {
            this.changeDialog(false);           
            this.$nextTick(() => {
                this.editedIndex = -1;
            })
            this.letDimensionMod=true;
            this.name  = "";
            this.description = "";
            this.price  = 0;
            this.shippingPrice  = 0;
            this.MQA  = 0;
            this.quantityAvailable  =0;
            this.brandSelected  = 0 ;
            this.providerSelected = [];
            this.categorieSelected  = 0;
            this.catalogueSelected   = 0;        
            this.selectedFiles = null;              
            this.X =0;
            this.Y =0;
            this.Z = 0;
        }
        
    async save () {     
        this.isLoading = true;
        console.log(this.editedIndex);
        if(this.editedIndex == -1){
            if( this.name=='' ||
                this.description=='' ||
                this.price==0 ||
                this.shippingPrice==0||
                this.MQA==0||
                this.quantityAvailable==0||
                this.brandSelected==0||
                this.providerSelected==[]||
                this.categorieSelected==0||
                this.catalogueSelected==0||
                this.selectedFiles==null||
                this.X==0||
                this.Y==0||
                this.Z==0
            ){ 
                this.snackbarErrorCreate=true;    
                this.isLoading = false;           
            }
            else{
                this.checkQuantity();                
            }    
        }else{   
            console.log('updateProductObject');
            this.updateProductObject();
        }
    }

    previewFiles(event) {
        this.isLoading =true;   
        this.selectedFiles = event.target.files[0];                 
        this.isLoading=false;
    }  
        
    async mounted() {        
        this.snackbarBrands = await this.fetchBrands();
        this.snackbarProviders = await this.fetchProviders();
        this.snackbarCategories = await this.fetchCategories();  
        this.snackbarProducts = await this.fetchAllProducts();      
        this.snackbarCatalogues = await this.fetchAllCatalogues();     
    }

    async createProductObject(){
        this.snackbarErrorCreate=false;  
        const newProduct: ProductsInterface = {
            id:this.editedItem.id,
            productName: this.name,
            description: this.description,
            price: this.price,
            shippingPrice: this.shippingPrice,
            minimumQuantityAvailable: this.MQA,
            
            category: {
                id:this.categorieSelected
            },
            provider: { 
                id:this.providerSelected
            },
            brand:{
                id:this.brandSelected
            },           
        }

        
             
        await this.createProduct(newProduct);
        if(this.product!== false){
            console.log(`el id del producto es ${this.product.id}`)
            const imageAndProductID: ProductPhotoDto ={
                id: this.product.id,
                // @ts-ignore
                imageName: this.selectedFiles.name          
            }             

            const imageAndProductForFirebase={
                id: this.product.id,
                image: this.selectedFiles
            }          

            console.log(imageAndProductID);

            const dimensionSO: dimensionDto = {
                dimension:{
                    width: this.X,  
                    height:this.Y,
                    long: this.Z
                },
                id: this.product.id
            } 

            const inventory :InventoryProduct={
                quantity: this.quantityAvailable,
                product:{
                    id:this.product.id
                }
            }

            const newCatalogue: CatalogueDto ={
                id: this.catalogueSelected,
                category:{id: this.categorieSelected},
                product:{ id:this.product.id}
            }                    
            console.log(newCatalogue);

            await this.saveCatalogues(newCatalogue);
            await this.saveInventory(inventory);
            this.snackbarSuccessCreated=true;
            this.saveProductDimension(dimensionSO);
            this.firebaseResponse = await this.uploadImage(imageAndProductForFirebase);
            console.log(this.firebaseResponse);        
            if(this.firebaseResponse){                              
                    const imageAndProduct : ProductPhotoDto={
                        id: this.editedItem.id,
                        // @ts-ignore
                        imageName: this.selectedFiles.name
                    }
                    await this.saveProductPhotos(imageAndProductID);                
                //aqui llama a guardar el inventorio
                this.selectedFiles = null;
            }
        }else{
            this.snackbarfail=true;
            this.X=0;
            this.Y=0;
            this.Z=0;
        }                                            
        this.isLoading=false;
        this.product = true;
        this.name  = "";
        this.description = "";
        this.price  = 0;
        this.shippingPrice  = 0;
        this.MQA  = 0;
        this.quantityAvailable  =0;
        this.brandSelected  = 0 ;
        this.providerSelected = [];
        this.categorieSelected  = 0;
        this.catalogueSelected   = 0;        
        this.selectedFiles = null;              
        this.X =0;
        this.Y =0;
        this.Z = 0;
        this.changeDialog(false);
        this.$router.go(0);
    }

    async updateProductObject(){
     if((this.categorieSelected==0) && (this.catalogueSelected!==0)){
        this.snackbarCataloguesCategories=true;
    }else{
        const newProduct :ProductsInterface = {
                id:this.editedItem.id,
                productName: this.name,
                description: this.description,
                price: this.price,
                shippingPrice: this.shippingPrice,
                minimumQuantityAvailable: this.MQA,
                
                category: {
                    id:this.categorieSelected
                },
                provider: { 
                    id:this.providerSelected
                },
                brand:{
                    id:this.brandSelected
                }
            }


                


            if (this.quantityAvailable!==0){
                console.log(`actualizando cantidad con = ${this.quantityAvailable}`)
                const inventory :InventoryProduct = {
                    quantity: this.quantityAvailable,
                    product:{
                        id:this.editedItem.id
                    }
                }
                await this.updateInventory(inventory);
            }
 
            if(this.selectedFiles!==null){
                console.log("actualizando imagen")
                 const imageAndProductIDForFirebase={
                    image: this.selectedFiles,
                    id: this.editedItem.id
                }    
                const imageAndProductIDForDB: ProductPhotoDto={
                    // @ts-ignore
                    imageName: this.selectedFiles.name,
                    id: this.editedItem.id
                }                 
                this.isLoading=true;
                this.firebaseResponse = await this.uploadImage(imageAndProductIDForFirebase);
                if(this.firebaseResponse){                        
                    const imageAndProduct : ProductPhotoDto={
                        id: this.editedItem.id,
                        // @ts-ignore
                        imageName: this.selectedFiles.name
                    }

                    await this.saveProductPhotos(imageAndProductIDForDB);

                    this.selectedFiles = null;
                }
                this.selectedFiles = null;
            }
            console.log("actualizando producto..")
            this.snackbarSuccess = await this.updateProduct(newProduct);
            if ((this.categorieSelected!==0) && (this.catalogueSelected!==0)){
                console.log("actualizando caegoria")
                const newCatalogue: CatalogueDto ={
                    id: this.catalogueSelected,
                    category:{id: this.categorieSelected},
                    product:{id: this.editedItem.id}
                }      
                console.log(newCatalogue)
                await this.saveCatalogues(newCatalogue);
            }
            console.log("producto actualizado")
            this.isLoading=false;
            this.name  = "";
            this.description = "";
            this.price  = 0;
            this.shippingPrice  = 0;
            this.MQA  = 0;
            this.quantityAvailable  =0;
            this.brandSelected  = 0 ;
            this.providerSelected = [];
            this.categorieSelected  = 0;
            this.catalogueSelected   = 0;        
            this.selectedFiles = null;              
            this.X =0;
            this.Y =0;
            this.Z = 0;
            this.changeDialog(false);
            this.$router.go(0);
        }
    }
    

    checkQuantity(){
        if(parseInt(`${this.MQA}`) < parseInt(`${this.quantityAvailable}`)){
            this.createProductObject();            
        }else{                    
            this.snackbarMoreMinThanAvai=true;
            this.isLoading=false;
            console.log("no puede porque MQA >quantity");
        }
    }

    @brands.Action(FETCH_BRANDS) fetchBrands;
    @brands.Getter(GET_BRANDS) getBrands;

    @providers.Action(FETCH_PROVIDERS) fetchProviders;
    @providers.Getter(GET_PROVIDERS) getProviders;    

    @products.Getter(GET_PRODUCT_INDEX_ID) getProductIndexID;
    @products.Getter(GET_PRODUCTS) getProducts;
    @products.Action(UPDATE_PRODUCT) updateProduct;
    @products.Action(FETCH_ALL_PRODUCTS) fetchAllProducts;
    @products.Action(DELETE_PRODUCT) deleteProduct;
    @products.Action(CREATE_PRODUCT) createProduct;
    @products.Action(UPLOAD_IMAGE) uploadImage;
    @products.Action(SAVE_PRODUCT_PHOTOS) saveProductPhotos;
    @products.Action(SAVE_PRODUCT_DIMENSION) saveProductDimension;
    @products.Action(SAVE_INVENTORY_QUANTITY) saveInventory;
    @products.Action(UPDATE_INVENTORY_QUANTITY) updateInventory;

    @categoryModule.Action(CategoriesMethods.actions.FETCH_CATEGORIES) private fetchCategories;
    @categoryModule.Getter(CategoriesMethods.getters.GET_CATEGORIES) private getCategories;    

    @catalogueModule.Action(CatalogueMethods.actions.FETCH_ALL_CATALOGUES) private fetchAllCatalogues;
    @catalogueModule.Action(CatalogueMethods.actions.SAVE_CATALOGUE) private saveCatalogues;
    @catalogueModule.Getter(CatalogueMethods.getters.GET_CATALOGUES) private getCatalogues;
    }
</script>
<style>
    .container-page{
        position: relative;
        width: 100%;
        padding: 0;
    }
    .v-image__image--contain {
        background-position-y: 38% !important;
    }
    @media only screen and (max-width: 600px) {
        .v-window__prev, .v-window__next {
            top: calc(60% - 40px) !important;
        }
    }
     .login100-form-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 20px;
        width: 100%;
        height: 40px;
        background-color: #F1CABB;
        border-radius: 10px;
        font-size: 16px;
        color: #fff;
        line-height: 1.2;
        transition: all 0.4s;
        position: relative;
        z-index: 1;
    }
</style>