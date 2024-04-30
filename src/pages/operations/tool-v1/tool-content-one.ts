import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { MeterialCondition } from '../../../models/material.condition';
import { MaterialService } from '../../../providers/material.service';
import { Warehouse } from '../../../models/warehouse';
import { Classfication } from '../../../models/classfication';


@Component({
    template: `
    <div class = 'tool-content'>
        <ion-list *ngIf = 'this.type == "CK"'>
        <div class="find">
            <input placeholder="输入电站名称搜索" [(ngModel)] = 'stationName'>
        </div>
            <ng-container *ngFor = 'let warehouse of warehouses;let i = index' [class.gar-color] = ' i%2 == 0'>
            <div class="top" *ngIf = 'showStation(warehouse.warehouseName)'>
                <div class="art" (click) = 'select("ALL",warehouse)'>
                    {{warehouse.warehouseName}}
                    <div class="sure">
                        <ion-icon name="checkmark"  *ngIf = 'warehouse.select'></ion-icon>
                    </div>
                </div>

                <div  *ngFor = 'let children of (warehouse.children||[])'>
                    <div class="artchoose"  (click) = 'select("ALL",children)'>
                        {{children.warehouseName}}
                        <div class="sure">
                            <ion-icon name="checkmark"*ngIf = 'children.select'  ></ion-icon>
                        </div>
                    </div>

                    <div *ngFor = 'let children1 of (children.children||[])'>
                        <div class="artchoose third"   (click) = 'select("ALL",children1)'>
                            {{children1.warehouseName}}
                            <div class="sure">
                                <ion-icon name="checkmark" *ngIf = 'children1.select' ></ion-icon>
                            </div>
                        </div>

                        <div *ngFor = 'let children2 of (children1.children||[])'>
                            <div class="artchoose fouth"   (click) = 'select("ALL",children2)'>
                                {{children2.warehouseName}}
                                <div class="sure">
                                    <ion-icon name="checkmark" *ngIf = 'children2.select' ></ion-icon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </ng-container>
        </ion-list>

        <ion-list  *ngIf = 'this.type == "CLASS"'>
            <div class="top" *ngFor = 'let classfication of (classfications||[]) ;let i = index'[class.gar-color] = ' i%2 == 1' >
                <div class="art" (click) = 'select("ALL",classfication)'>
                    {{classfication.className}}
                    <div class="sure">
                        <ion-icon name="checkmark"  *ngIf = 'classfication.select'></ion-icon>
                    </div>
                </div>

                <div *ngFor = 'let children of (classfication.children||[])'>
                    <div class="artchoose"   (click) = 'select("ALL",children)'>
                        {{children.className}}
                        <div class="sure">
                            <ion-icon name="checkmark" *ngIf = 'children.select' ></ion-icon>
                        </div>
                    </div>

                    <div *ngFor = 'let children1 of (children.children||[])'>
                        <div class="artchoose third"   (click) = 'select("ALL",children1)'>
                            {{children1.className}}
                            <div class="sure">
                                <ion-icon name="checkmark" *ngIf = 'children1.select' ></ion-icon>
                            </div>
                        </div>

                        <div *ngFor = 'let children2 of (children1.children||[])'>
                            <div class="artchoose fouth"   (click) = 'select("ALL",children2)'>
                                {{children2.className}}
                                <div class="sure">
                                    <ion-icon name="checkmark" *ngIf = 'children2.select' ></ion-icon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </ion-list>

        <ion-list  *ngIf = 'this.type == "INVENTORY"'>
            <div class="top" *ngFor = 'let inventoryCate of inventoryCates ;let i = index' [class.gar-color] = ' i%2 == 1'>
                <div class="art" (click) = 'select("ALL",inventoryCate)'>
                    {{inventoryCate.name}}
                    <div class="sure"><ion-icon name="checkmark"  *ngIf = 'inventoryCate.select' ></ion-icon> </div>
                </div>
            </div>
        </ion-list>
</div>
<ion-footer>
            <div class="bnt">
                <div class="bnt-left" (click) = resetModel()>重置</div>
                <div class="bnt-left bnt-right" (click) = 'close()'>确定</div>
            </div>
            </ion-footer>
    `
  })
  export class ToolonePage {
    meterialCondition:MeterialCondition;
    type:string;
    warehouses:Warehouse[];
    classfications:Classfication[];
    inventoryCates:{}[] = [{name:'正常库存',value:'01',select:false},{name:'异常库存',value:'02',select:false}];
    stationName
    constructor(
        public viewCtrl: ViewController,
        public navparams:NavParams,
        public materialService : MaterialService
    ) {
        this.meterialCondition = this.navparams.get('meterialCondition');
        this.type = this.navparams.get('type');
    }


    ionViewWillEnter() {
        switch(this.type){
            case 'CK':
            this.getWarehouse();
            break;
            case 'CLASS':
            this.getclassfications();
            break;
            case'INVENTORY':
            if (this.meterialCondition.inventoryCates) {
                for (let index = 0; index < this.inventoryCates.length; index++) {
                    const prop = this.inventoryCates[index];
                    prop['select'] = this.meterialCondition.inventoryCates.indexOf(prop['value'])>-1
                }
            }else{
                this.inventoryCates = [{name:'正常库存',value:'01',select:false},{name:'异常库存',value:'02',select:false}];
            }
            break;

        }
    }

    /**
     * 仓库查询
     */
    public getWarehouse(){
        this.materialService.getWarehouse().subscribe(e=>{
            if (e) {
                this.warehouses = e;
                if (this.meterialCondition.warehouseIds) {
                    for (let index = 0; index < e.length; index++) {
                      const prop = e[index];
                      prop['select'] = this.meterialCondition.warehouseIds.indexOf(prop['warehouseId'])>-1;
                      this.selectAllChildren(prop,this.meterialCondition.warehouseIds,'warehouseId');
                    }
                }
            }else{
                this.warehouses = [];
            }
            console.log(e)
        })
    }

    selectAllChildren(prop,stringArr,code){
        if (prop && prop.children) {
            for(let children of (prop.children||[])  ){
                children['select'] = stringArr.indexOf(children[code])>-1;
                this.selectAllChildren(children,stringArr,code);
            }
        }
    }

     /**
     * 工具备件类别
     */
    public getclassfications(){
        this.materialService.getclassfications(this.meterialCondition.classType).subscribe(e=>{
            if (e) {
               this.classfications = e;
               if (this.meterialCondition.materialClasses) {
                    for (let index = 0; index < e.length; index++) {
                        const prop = e[index];
                        prop['select'] = this.meterialCondition.materialClasses.indexOf(prop['classId'])>-1;
                        this.selectAllChildren(prop,this.meterialCondition.materialClasses,'classId');
                    }
                }
            }else{
                this.classfications = [];
            }
        })
    }

    selectChildren(obj){
        if (obj.children) {
            for(let children of obj.children){
                children.select =  obj.select;
                this.selectChildren(children);
            }
        }
    }

    select(type,obj){
        switch(type){
            case 'ALL':
            obj.select = !obj.select;
            this.selectChildren(obj)
            break;
            case 'ONE':
            obj.select  = !obj.select;
            break;
        }
    }


    getChildrenId(obj , strings,idname){
        if (obj && obj.children) {
            for(let children of (obj.children||[])){
                if (children['select']) {
                    strings = strings + children[idname] + ',';
                }
                strings = this.getChildrenId(children , strings,idname)
            }
        }
        return strings;
    }

    //获取选中仓库id
    getWarehouseIds():string{
        let warehouseIds = '';
        if ( this.warehouses &&  this.warehouses.length>0) {
            for (let index = 0; index < this.warehouses.length; index++) {
                const warehouse = this.warehouses[index];
                if (warehouse['select']) {
                    warehouseIds = warehouseIds + warehouse.warehouseId + ',';
                }
                warehouseIds = this.getChildrenId(warehouse,warehouseIds,'warehouseId')
            }
        }
        if (warehouseIds){
            warehouseIds = warehouseIds.slice(0,warehouseIds.length-1);
        }else{
            warehouseIds = null;
        }
        return warehouseIds;
    }

       //获取选中工具备件类别Id
       getMaterialClasses():string{
        let materialClasses = '';
        if ( this.classfications &&  this.classfications.length>0) {
            for (let index = 0; index < this.classfications.length; index++) {
                const classfication = this.classfications[index];
                if (classfication['select']) {
                    materialClasses = materialClasses + classfication.classId + ',';
                }
                materialClasses = this.getChildrenId(classfication,materialClasses,'classId')
            }
        }
        if (materialClasses){
            materialClasses = materialClasses.slice(0,materialClasses.length-1);
        } else{
            materialClasses = null;
        }
        return materialClasses;
    }

    //获取选中库存类别Id
    getInventoryCates():string{
        if (this.inventoryCates[0]['select']) {
            this.meterialCondition.inventoryCates
        }
        let inventoryCates = '';
        if ( this.inventoryCates &&  this.inventoryCates.length>0) {
           for(let inventoryCate of this.inventoryCates){
               if (inventoryCate['select']) {
                    inventoryCates = inventoryCates + inventoryCate['value'] + ','
               }
           }
        }
        if (inventoryCates){
            inventoryCates = inventoryCates.slice(0,inventoryCates.length-1);
        } else{
            inventoryCates = null;
        }
        return inventoryCates;
    }
    close() {
        switch(this.type){
            case 'CK':
            //添加仓库条件
            this.meterialCondition.warehouseIds = this.getWarehouseIds();
            break;
            case 'CLASS':
            //添加工具备件类别条件
            this.meterialCondition.materialClasses = this.getMaterialClasses();
            break;
            case'INVENTORY':
            //添加库存类别条件
            this.meterialCondition.inventoryCates = this.getInventoryCates()
            break;
        }
      this.viewCtrl.dismiss(this.meterialCondition);
    }
    resetModel(){
        // this.ionViewWillEnter();

        switch(this.type){
            case 'CK':
            this.unselectAll(this.warehouses);
            break;
            case 'CLASS':
            //添加工具备件类别条件
            this.unselectAll(this.classfications);
            break;
            case'INVENTORY':
            //添加库存类别条件
            this.inventoryCates = [{name:'正常库存',value:'01',select:false},{name:'异常库存',value:'02',select:false}];
            break;
        }
    }

    unselectAll(arrs){
        if (arrs) {
            for(let obj of arrs){
                obj.select = false;
                if (obj.children) {
                  this.unselectAll(obj.children)  ;
                }
            }
        }
    }

    /**电站筛选 */
    showStation(name){
        if(this.stationName && this.stationName !== 0){
            return name.indexOf(this.stationName)>=0
        }else {
            return true
        }
    }
  }
