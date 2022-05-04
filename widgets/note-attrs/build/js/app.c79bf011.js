(function(){"use strict";var e={9264:function(e,t,a){var l={};a.r(l),a.d(l,{ReplaceBR:function(){return de},ReplaceSpace:function(){return ce},arraySort:function(){return ke},copyText:function(){return re},cutString:function(){return ve},dateFormat:function(){return we},friendlyTime:function(){return ue},getAttrType:function(){return xe},getDocumentID:function(){return Le},getWidgetID:function(){return _e},htmlDecode:function(){return be},miniSearch:function(){return Ce},openNote:function(){return te},praseJSON:function(){return fe},randomWord:function(){return se},selectOptionStyle:function(){return oe},siyuanTimeFormat:function(){return ye},siyuanTimeToDate:function(){return ge},siyuanTimeToDateStr:function(){return pe},siyuanTimeToTimestamp:function(){return me},stringPin:function(){return ie},tagStyle:function(){return ne},timestampFormat:function(){return he},toArray:function(){return ae},toBoolean:function(){return le}});var n=a(9242),o=a(3396),r=a(7139);const s=["innerHTML"],i={class:"attr-name"},d=["innerHTML"],c={class:"overflow"},u={class:"attr_setting"},p={class:"attr_setting_row"},m={class:"attr_setting_row"},g={style:{display:"flex","align-items":"center"}},h=["innerHTML"],y={class:"attr_setting_row"},w=(0,o._)("span",{class:"attr_setting_label"},"字段名：",-1),v={class:"attr_setting_value"},f={class:"attr_setting_row"},b=(0,o._)("span",{class:"attr_setting_label"},"来源：",-1),k={class:"attr_setting_value"},C={key:0,class:"attr_setting_row"},_=(0,o.Uk)(" 删除字段 "),L={key:0,class:"attr-value"},x={key:5,style:{"padding-left":"8px"}},V=(0,o.Uk)("+"),A={key:1,class:"attr-value",style:{"padding-left":"11px"}},M={class:"label"},U={class:"name"},S={class:"type"},D={style:{display:"flex","align-items":"center"}},O=["innerHTML"],Z={class:"value"},T={class:"save"},I=(0,o.Uk)("保存"),j={class:"label"},B={style:{display:"flex","align-items":"center"}},Y=["innerHTML"],H={style:{color:"#999","margin-left":"8px","font-size":"13px"}},z={class:"value"},E={class:"save"},$=(0,o.Uk)("保存"),W={class:"btns"},K=(0,o.Uk)(" 添加新字段 "),P=(0,o.Uk)(" 选择已有字段 "),N=(0,o.Uk)(" 保存字段到文档 ");function q(e,t,a,l,q,F){const R=(0,o.up)("el-input"),Q=(0,o.up)("el-option"),J=(0,o.up)("el-select"),G=(0,o.up)("el-button"),X=(0,o.up)("el-popover"),ee=(0,o.up)("el-input-number"),te=(0,o.up)("el-date-picker"),ae=(0,o.up)("el-rate"),le=(0,o.up)("el-checkbox"),ne=(0,o.up)("el-tag"),oe=(0,o.up)("draggable");return(0,o.wg)(),(0,o.iD)("div",{id:"attrs-panel",onMousemove:t[6]||(t[6]=(...t)=>e.resizeIframe&&e.resizeIframe(...t))},[(0,o.Wm)(oe,{modelValue:e.widget.attributes,"onUpdate:modelValue":t[1]||(t[1]=t=>e.widget.attributes=t),group:"attrs","item-key":"label",class:"attrs-list",onEnd:t[2]||(t[2]=t=>e.widget.saveAttrsOrder(e.widget))},{default:(0,o.w5)((()=>[((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(e.widget.attributes,((a,l)=>((0,o.wg)(),(0,o.iD)("div",{class:"attr-item",key:a.name},[(0,o._)("div",{innerHTML:e.icons["drag"],class:"drag"},null,8,s),(0,o.Wm)(X,{trigger:"click",width:200,"show-arrow":!1,onHide:t=>e.widget.saveAttrInfor(a)},{reference:(0,o.w5)((()=>[(0,o._)("div",i,[(0,o._)("span",{innerHTML:e.icons[a.type||"text"],class:"icon"},null,8,d),(0,o._)("span",c,(0,r.zw)(a.label||a.name.replaceAll("_","-")),1)])])),default:(0,o.w5)((()=>[(0,o._)("div",u,[(0,o._)("div",p,[(0,o.Wm)(R,{modelValue:a.label,"onUpdate:modelValue":e=>a.label=e,placeholder:"请填写展示名称",minlength:"2",maxlength:"30",autofocus:"",clearable:""},null,8,["modelValue","onUpdate:modelValue"])]),(0,o._)("div",m,[(0,o.Wm)(J,{modelValue:a.type,"onUpdate:modelValue":e=>a.type=e,style:{width:"100%"}},{default:(0,o.w5)((()=>[((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(e.Config.attr_types,((t,a)=>((0,o.wg)(),(0,o.j4)(Q,{key:a,label:t.value,value:t.name,"popper-class":"select_option"},{default:(0,o.w5)((()=>[(0,o._)("div",g,[(0,o._)("span",{innerHTML:e.icons[t.name],class:"icon"},null,8,h),(0,o.Uk)((0,r.zw)(t.value),1)])])),_:2},1032,["label","value"])))),128))])),_:2},1032,["modelValue","onUpdate:modelValue"])]),(0,o._)("div",y,[w,(0,o._)("span",v,(0,r.zw)(a.name.replaceAll("_","-")),1)]),(0,o._)("div",f,[b,(0,o._)("span",k,(0,r.zw)(-1==a.name.indexOf("custom")?"系统字段":"自定义"),1)]),a.name.indexOf("custom")>-1?((0,o.wg)(),(0,o.iD)("div",C,[(0,o.Wm)(G,{type:"warning",style:{width:"100%"},plain:"",onClick:t=>e.widget.removeAttr(a,l,e.widget)},{default:(0,o.w5)((()=>[_])),_:2},1032,["onClick"])])):(0,o.kq)("",!0)])])),_:2},1032,["onHide"]),a.name.indexOf("custom")>-1||"tags"==a.name?((0,o.wg)(),(0,o.iD)("div",L,["text"==a.type?((0,o.wg)(),(0,o.j4)(R,{key:0,modelValue:a.value,"onUpdate:modelValue":e=>a.value=e,placeholder:"请输入属性值",class:"noborder",disabled:"system"==a.source,clearable:"",onChange:t=>e.widget.saveAttrValue(a,e.widget)},null,8,["modelValue","onUpdate:modelValue","disabled","onChange"])):"number"==a.type?((0,o.wg)(),(0,o.j4)(ee,{key:1,modelValue:a.value,"onUpdate:modelValue":e=>a.value=e,controls:!1,class:"noborder",disabled:"system"==a.source,onChange:t=>e.widget.saveAttrValue(a,e.widget)},null,8,["modelValue","onUpdate:modelValue","disabled","onChange"])):"date"==a.type?((0,o.wg)(),(0,o.j4)(te,{key:2,modelValue:a.value,"onUpdate:modelValue":e=>a.value=e,type:"date",placeholder:"设置日期",format:"YYYY-MM-DD","value-format":"YYYY-MM-DD HH:mm:ss",class:"noborder",disabled:"system"==a.source,onChange:t=>e.widget.saveAttrValue(a,e.widget)},null,8,["modelValue","onUpdate:modelValue","disabled","onChange"])):"rate"==a.type?((0,o.wg)(),(0,o.j4)(ae,{key:3,modelValue:a.value,"onUpdate:modelValue":e=>a.value=e,disabled:"system"==a.source,style:{"margin-left":"11px"},onChange:t=>e.widget.saveAttrValue(a,e.widget)},null,8,["modelValue","onUpdate:modelValue","disabled","onChange"])):"checkbox"==a.type?((0,o.wg)(),(0,o.j4)(le,{key:4,modelValue:a.value,"onUpdate:modelValue":e=>a.value=e,"true-label":"true","false-label":"false",disabled:"system"==a.source,style:{"margin-left":"11px"},onChange:t=>e.widget.saveAttrValue(a,e.widget)},null,8,["modelValue","onUpdate:modelValue","disabled","onChange"])):"select"==a.type||"multi_select"==a.type?((0,o.wg)(),(0,o.iD)("div",x,[((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(e.Utils.toArray(a.value),(t=>((0,o.wg)(),(0,o.j4)(ne,{key:t,class:(0,r.C_)(["select",e.randomColor()]),onClose:l=>e.widget.removeSelectItem(a,t,e.widget),closable:""},{default:(0,o.w5)((()=>[(0,o.Uk)((0,r.zw)(t),1)])),_:2},1032,["class","onClose"])))),128)),e.selectOption.index==l?((0,o.wg)(),(0,o.j4)(R,{key:0,class:"select-input",modelValue:e.selectOption.value,"onUpdate:modelValue":t[0]||(t[0]=t=>e.selectOption.value=t),autofocus:"",onKeyup:(0,n.D2)((t=>e.appendSelectItem(a)),["enter"])},null,8,["modelValue","onKeyup"])):(0,o.kq)("",!0),"select"==a.type&&0==e.Utils.toArray(a.value)||"multi_select"==a.type?((0,o.wg)(),(0,o.j4)(ne,{key:1,class:"select grey",onClick:t=>e.showSelectInput(l)},{default:(0,o.w5)((()=>[V])),_:2},1032,["onClick"])):(0,o.kq)("",!0)])):((0,o.wg)(),(0,o.j4)(R,{key:6,modelValue:a.value,"onUpdate:modelValue":e=>a.value=e,placeholder:"请输入属性值",disabled:"system"==a.source,clearable:"",onChange:t=>e.widget.saveAttrValue(a,e.widget)},null,8,["modelValue","onUpdate:modelValue","disabled","onChange"]))])):((0,o.wg)(),(0,o.iD)("div",A,(0,r.zw)("created"==a.name||"updated"==a.name?e.Utils.siyuanTimeToDateStr(a.value):a.value),1))])))),128))])),_:1},8,["modelValue"]),((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(e.widget.createAttrs,((t,a)=>((0,o.wg)(),(0,o.iD)("div",{class:"new-attr",key:a},[(0,o._)("div",M,[(0,o.Wm)(R,{type:"text",modelValue:t.label,"onUpdate:modelValue":e=>t.label=e,placeholder:"展示名称",onBlur:a=>e.widget.checkAttrFormat(t),clearable:""},null,8,["modelValue","onUpdate:modelValue","onBlur"])]),(0,o._)("div",U,[(0,o.Wm)(R,{type:"text",modelValue:t.name,"onUpdate:modelValue":e=>t.name=e,placeholder:"字段名，字母 + 数字 + '-'",onBlur:a=>e.widget.checkAttrFormat(t),clearable:""},null,8,["modelValue","onUpdate:modelValue","onBlur"])]),(0,o._)("div",S,[(0,o.Wm)(J,{modelValue:t.type,"onUpdate:modelValue":e=>t.type=e},{default:(0,o.w5)((()=>[((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(e.Config.attr_types,((t,a)=>((0,o.wg)(),(0,o.j4)(Q,{key:a,label:t.value,value:t.name,"popper-class":"select_option"},{default:(0,o.w5)((()=>[(0,o._)("div",D,[(0,o._)("span",{innerHTML:e.icons[t.name],class:"icon"},null,8,O),(0,o.Uk)((0,r.zw)(t.value),1)])])),_:2},1032,["label","value"])))),128))])),_:2},1032,["modelValue","onUpdate:modelValue"])]),(0,o._)("div",Z,["text"==t.type||"img"==t.type||"select"==t.type||"multi_select"==t.type?((0,o.wg)(),(0,o.j4)(R,{key:0,modelValue:t.value,"onUpdate:modelValue":e=>t.value=e,placeholder:"text"==t.type?"请输入属性值":"img"==t.type?"网络图片或附件地址":"select"==t.type?"请输入选项值":"以 , 作为分割（支持中文逗号）",clearable:"",onKeyup:(0,n.D2)((l=>e.widget.saveNewAttr("create",a,t,e.widget)),["enter"])},null,8,["modelValue","onUpdate:modelValue","placeholder","onKeyup"])):"number"==t.type?((0,o.wg)(),(0,o.j4)(ee,{key:1,modelValue:t.value,"onUpdate:modelValue":e=>t.value=e},null,8,["modelValue","onUpdate:modelValue"])):"date"==t.type?((0,o.wg)(),(0,o.j4)(te,{key:2,modelValue:t.value,"onUpdate:modelValue":e=>t.value=e,type:"date",placeholder:"设置日期",format:"YYYY-MM-DD","value-format":"YYYY-MM-DD HH:mm:ss"},null,8,["modelValue","onUpdate:modelValue"])):"rate"==t.type?((0,o.wg)(),(0,o.j4)(ae,{key:3,modelValue:t.value,"onUpdate:modelValue":e=>t.value=e},null,8,["modelValue","onUpdate:modelValue"])):"checkbox"==t.type?((0,o.wg)(),(0,o.j4)(le,{key:4,modelValue:t.value,"onUpdate:modelValue":e=>t.value=e,"true-label":"true","false-label":"false"},null,8,["modelValue","onUpdate:modelValue"])):(0,o.kq)("",!0)]),(0,o._)("div",T,[(0,o.Wm)(G,{type:"primary",onClick:l=>e.widget.saveNewAttr("create",a,t,e.widget)},{default:(0,o.w5)((()=>[I])),_:2},1032,["onClick"])])])))),128)),((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(e.widget.selectAttrs,((t,a)=>((0,o.wg)(),(0,o.iD)("div",{class:"new-attr",key:a},[(0,o._)("div",j,[(0,o.Wm)(J,{modelValue:t.name,"onUpdate:modelValue":e=>t.name=e,onChange:l=>e.widget.selectAttrName(t,a,e.widget),placeholder:"选择字段"},{default:(0,o.w5)((()=>[((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(e.attrsSelectOptions,((t,a)=>((0,o.wg)(),(0,o.j4)(Q,{key:a,label:t.label,value:t.name,"popper-class":"select_option"},{default:(0,o.w5)((()=>[(0,o._)("div",B,[(0,o._)("span",{innerHTML:e.icons[t.type],class:"icon"},null,8,Y),(0,o._)("span",null,(0,r.zw)(t.label),1),(0,o._)("span",H,(0,r.zw)(t.name.replaceAll("_","-")),1)])])),_:2},1032,["label","value"])))),128))])),_:2},1032,["modelValue","onUpdate:modelValue","onChange"])]),(0,o._)("div",z,["text"==t.type||"img"==t.type||"select"==t.type||"multi_select"==t.type?((0,o.wg)(),(0,o.j4)(R,{key:0,modelValue:t.value,"onUpdate:modelValue":e=>t.value=e,placeholder:"text"==t.type?"请输入属性值":"img"==t.type?"网络图片或附件地址":"select"==t.type?"请输入选项值":"以 , 作为分割（支持中文逗号）",clearable:"",onKeyup:(0,n.D2)((l=>e.widget.saveNewAttr("select",a,t,e.widget)),["enter"])},null,8,["modelValue","onUpdate:modelValue","placeholder","onKeyup"])):"number"==t.type?((0,o.wg)(),(0,o.j4)(ee,{key:1,modelValue:t.value,"onUpdate:modelValue":e=>t.value=e},null,8,["modelValue","onUpdate:modelValue"])):"date"==t.type?((0,o.wg)(),(0,o.j4)(te,{key:2,modelValue:t.value,"onUpdate:modelValue":e=>t.value=e,type:"date",placeholder:"设置日期",format:"YYYY-MM-DD","value-format":"YYYY-MM-DD HH:mm:ss"},null,8,["modelValue","onUpdate:modelValue"])):"rate"==t.type?((0,o.wg)(),(0,o.j4)(ae,{key:3,modelValue:t.value,"onUpdate:modelValue":e=>t.value=e},null,8,["modelValue","onUpdate:modelValue"])):"checkbox"==t.type?((0,o.wg)(),(0,o.j4)(le,{key:4,modelValue:t.value,"onUpdate:modelValue":e=>t.value=e,"true-label":"true","false-label":"false"},null,8,["modelValue","onUpdate:modelValue"])):(0,o.kq)("",!0)]),(0,o._)("div",E,[(0,o.Wm)(G,{type:"primary",onClick:l=>e.widget.saveNewAttr("select",a,t,e.widget)},{default:(0,o.w5)((()=>[$])),_:2},1032,["onClick"])])])))),128)),(0,o._)("div",W,[(0,o.Wm)(G,{class:"add-btn",type:"text",icon:e.ElIcons.Plus,onClick:t[3]||(t[3]=t=>e.widget.appendAttr("create",e.widget))},{default:(0,o.w5)((()=>[K])),_:1},8,["icon"]),(0,o.Wm)(G,{class:"add-btn",type:"text",icon:e.ElIcons.Tickets,onClick:t[4]||(t[4]=t=>e.widget.appendAttr("select",e.widget))},{default:(0,o.w5)((()=>[P])),_:1},8,["icon"]),(0,o.Wm)(G,{class:"add-btn",type:"text",icon:e.ElIcons.Download,onClick:t[5]||(t[5]=t=>e.widget.downloadAttrs(e.widget))},{default:(0,o.w5)((()=>[N])),_:1},8,["icon"])])],32)}var F,R=a(2482);a(1703);(function(e){e["SetBlockAttrs"]="set_block_attrs",e["GetBlockAttrs"]="get_block_attrs",e["UpdateBlock"]="update_block",e["QuerySQL"]="query_sql",e["PrependBlock"]="prepend_block"})(F||(F={}));const Q=0,J={host:Q?"http://127.0.0.1:6806":"http://"+window.location.host,mock_widget_id:"20220504142602-he95vh1",api:[{name:"查询SQL",type:F.QuerySQL,url:"/api/query/sql"},{name:"设置属性",type:F.SetBlockAttrs,url:"/api/attr/setBlockAttrs"},{name:"获取属性",type:F.GetBlockAttrs,url:"/api/attr/getBlockAttrs"},{name:"更新块",type:F.UpdateBlock,url:"/api/block/updateBlock"},{name:"插入前置子块",type:F.PrependBlock,url:"/api/block/prependBlock"}],tag_colors:[{name:"red",color:"rgb(152, 13, 15)",background:"rgba(203, 64, 66, 0.2)"},{name:"blue",color:"rgb(0, 118, 172)",background:"rgba(46, 169, 223, 0.2)"},{name:"green",color:"rgb(0, 78, 11)",background:"rgba(27, 129, 62, 0.2)"},{name:"yellow",color:"rgb(204, 145, 0)",background:"rgba(255, 196, 8, 0.2)"},{name:"orange",color:"rgb(198, 88, 0)",background:" rgba(249, 139, 42, 0.2)"},{name:"brown",color:"rgb(65, 52, 11)",background:"rgba(116, 103, 62, 0.2)"},{name:"purple",color:" rgb(55, 25, 105)",background:"rgba(106, 76, 156, 0.2)"},{name:"grey",color:"rgb(111, 113, 115)",background:"rgba(162, 164, 166, 0.2)"}],attr_types:[{name:"text",value:"文本"},{name:"number",value:"数字"},{name:"date",value:"日期"},{name:"rate",value:"评分"},{name:"select",value:"单选"},{name:"multi_select",value:"多选"},{name:"checkbox",value:"勾选框"},{name:"img",value:"图片"}],block_types:{doc:"文档",d:"文档",h:"标题",l:"列表",i:"列表项",c:"代码",m:"数学公式",p:"段落",t:"表格",s:"超级块",html:"HTML",widget:"挂件",iframe:"iframe",query_embed:"嵌入块",video:"视频"},uneditable_attrs:["id","created","updated","title_img"],system_attrs:[{name:"created",label:"创建时间",type:"date",source:"system"},{name:"updated",label:"更新时间",type:"date",source:"system"},{name:"title_img",label:"题头图",type:"img",source:"system"},{name:"tags",label:"文档标签",type:"multi_select",source:"system"},{name:"title",label:"文档标题",type:"text",source:"system"},{name:"alias",label:"别名",type:"text",source:"system"},{name:"name",label:"命名",type:"text",source:"system"}]};var G=a(5574);async function X(e,t,a=""){const l=J.api.find((t=>t.type===e));return new Promise(((n,o)=>{l?ee(J.host+l.url,t).then((t=>{0==t.code?n({code:0,data:t.data,msg:""}):(G.z8.error(a||"网络请求错误 ["+e+"]："+t.msg),n({code:-1,data:{},msg:t.msg}))})).catch((t=>{G.z8.error(a||"网络请求错误 ["+e+"]："+t.message),n({code:-1,data:{},msg:t.message})})):o({code:-1,data:{},msg:`${e} 接口类型不存在`})}))}function ee(e,t,a="POST"){return new Promise(((n,o)=>{"POST"==a.toUpperCase()?fetch(e,{method:"POST",headers:{"Content-Type":"application/json","User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36"},body:JSON.stringify(t)}).then(l).then((e=>n(e))).catch((e=>o(e))):fetch(e,{method:"GET",headers:{"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36"}}).then(l).then((e=>n(e))).catch((e=>o(e)))}));function l(e){const t=e.headers.get("content-type");if(t.includes("application/json"))return n(e);if(t.includes("text/html"))return o(e);throw new Error(`Sorry, content-type ${t} not supported`)}function n(e){return e.json().then((t=>e.ok?t:Promise.reject(Object.assign({},t,{status:e.status,statusText:e.statusText}))))}function o(e){return e.text().then((t=>e.ok?t:Promise.reject({status:e.status,statusText:e.statusText,err:t})))}}const te=e=>{window.open("siyuan://blocks/"+e,"_blank")},ae=e=>e?String(e).replaceAll("，",",").split(","):[],le=e=>{const t=typeof e;return"boolean"===t?e:"string"===t?"true"===e||"1"===e||"yes"===e:"number"===t&&1===e},ne=(e,t,a)=>{const l=a.find((e=>e.name==t));if(l){const t=l.options,a=t.find((t=>t.value==e));return a?a.color:"grey"}return"grey"},oe=e=>{const t=J.tag_colors.find((t=>t.name==e));return t?`background: ${t.background};color: ${t.color};`:"color: rgb(111, 113, 115);background-color: rgba(162, 164, 166, 0.2);"};async function re(e){try{await navigator.clipboard.writeText(e)}catch(t){console.error("Failed to copy: ",t)}}const se=(e,t,a)=>{let l="",n=t;const o=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];e&&(n=Math.round(Math.random()*(a-t))+t);for(let r=0;r<n;r++){const e=Math.round(Math.random()*(o.length-1));l+=o[e]}return l},ie=(...e)=>{if(0===e.length)return"";{const t=e.reduce(((e,t)=>String(e)+String(t)));return t}},de=(e,t)=>e.replace(/[\r\n]+/g,t),ce=(e,t)=>e.replace(/\s+/g,t),ue=e=>{if(!e)return"";const t=new Date,a=t.getFullYear(),l=new Date(e).getFullYear();return he(e,a==l?"M月d日 hh:mm:ss":"yyyy年M月d日 hh:mm:ss")},pe=e=>e.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/,"$1-$2-$3 $4:$5:$6"),me=e=>{try{return new Date(pe(e)).getTime()}catch{return 0}},ge=e=>new Date(pe(e)),he=(e,t)=>we(new Date(e),t),ye=(e,t)=>we(new Date(me(e)),t),we=(e,t)=>{const a={"M+":e.getMonth()+1,"d+":e.getDate(),"h+":e.getHours(),"m+":e.getMinutes(),"s+":e.getSeconds(),"q+":Math.floor((e.getMonth()+3)/3),S:e.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(e.getFullYear()+"").substr(4-RegExp.$1.length)));for(const l in a)new RegExp("("+l+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?a[l]:("00"+a[l]).substr((""+a[l]).length)));return t},ve=(e,t)=>e.length>t?e.substr(0,t)+"...":e,fe=e=>{if(!e)return!1;try{return JSON.parse(e)}catch(t){return console.log(`JSON 解析失败: ${e}`),!1}},be=e=>{try{let t="";return 0==e.length?"":(t=e.replace(/&amp;/g,"&"),t=t.replace(/&lt;/g,"<"),t=t.replace(/&gt;/g,">"),t=t.replace(/&nbsp;/g," "),t=t.replace(/&#39;/g,"'"),t=t.replace(/&quot;/g,'"'),t)}catch(t){return""}},ke=e=>{const t=e,a=e.length;for(let l=0;l<a;l++)for(let e=0;e<a-1-l;e++){const a=t[e]["order"],l=t[e+1]["order"];let n="string"==typeof a?parseInt(a):a,o="string"==typeof l?parseInt(l):l;if(n=n||0,o=o||0,n>o){const a=t[e+1];t[e+1]=t[e],t[e]=a}}return t},Ce=(e,t=50)=>X(F.QuerySQL,{stmt:`select * from blocks where (content like '%${e}%' or id = '${e}') and type = 'd' limit ${t}`}),_e=()=>{const e=window.frameElement,t=e?.parentElement?.parentElement;return null!=t?{code:0,data:{id:t.dataset.nodeId,node:t}}:{code:-1,data:{}}};async function Le(e){const{code:t,msg:a,data:l}=await X(F.QuerySQL,{stmt:`SELECT root_id FROM blocks WHERE id = '${e}'`});return 0===t&&l.length>0?l[0].root_id:""}const xe=(e,t)=>{const a=t.attributes.find((t=>t.name===e));return a?a.type:"text"};var Ve=a(7603);class Ae extends Ve.ZP{constructor(){super("NoteViews"),(0,R.Z)(this,"shared_attrs",void 0),(0,R.Z)(this,"widget_attrs",void 0),(0,R.Z)(this,"defaultSchema",{notes:"[widget_id+block_id], id, content, title, alias, created, updated, title_img, tags, hpath, box, memo, type",shared_attrs:"&name, label, type",widget_attrs:"&widget_id, attrs"})}async init(){if(await Ve.ZP.exists("NoteViews")){await this.open();const e=this.verno,t=this.tables.reduce(((e,{name:t,schema:a})=>(e[t]=[a.primKey.src,...a.indexes.map((e=>e.src))].join(","),e)),{});this.close(),this.version(e).stores(t),await this.open()}else{console.log("初始化 IndexedDB 数据库"),this.version(.1).stores(this.defaultSchema),await this.open();for(const e in J.system_attrs)await this.shared_attrs.add(J.system_attrs[e])}}}const Me=new Ae;class Ue{constructor(){(0,R.Z)(this,"widgetID",""),(0,R.Z)(this,"documentID",""),(0,R.Z)(this,"sharedAttrs",[]),(0,R.Z)(this,"attributes",[]),(0,R.Z)(this,"createAttrs",[]),(0,R.Z)(this,"selectAttrs",[])}async init(){const e=_e();if(e.code=Q?1:e.code,e.data=Q?{id:J.mock_widget_id,node:document.createElement("div")}:e.data,-1===e.code)throw console.log("获取挂件 ID 失败"),new Error("获取挂件 ID 失败");{this.widgetID=e.data.id,this.documentID=await Le(this.widgetID),await Me.init(),this.sharedAttrs=await Me.shared_attrs.toArray();const t=await X(F.GetBlockAttrs,{id:this.documentID},"获取挂件设置失败，请尝试重新加载");0==t.code&&await this.loadSettings(t.data)}}async loadSettings(e){if(!e)return void G.z8.warning("属性为空");const t=e["custom-doc-attrs"]?JSON.parse(be(e["custom-doc-attrs"])):[];for(const a in e){const l=a.replaceAll("-","_"),n=be(e[a]),o=t.find((e=>e.name===l)),r=this.sharedAttrs.find((e=>e.name===l)),s={name:r?r.name:l,label:r?r.label:"",type:r?r.type:"text",order:o?o.order:99,source:l.indexOf("custom")>-1?"custom":"system",value:n};-1==["custom_doc_attrs","id","title_img","title","icon","type"].indexOf(l)&&this.attributes.push(s)}this.attributes=ke(this.attributes)}async saveAttrInfor(e){console.log(e),Me.shared_attrs.put({name:e.name,label:e.label,type:e.type})}async saveAttrsOrder(e=this){const t=[];for(const[a,l]of this.attributes.entries())l.order=a,t.push({name:l.name,order:a});X(F.SetBlockAttrs,{id:e.documentID,attrs:{"custom-doc-attrs":JSON.stringify(t)}})}async saveAttrValue(e,t=this){const a={},l=e.name.replaceAll("_","-"),n="number"==typeof e.value?String(e.value):e.value;a[l]=n,X(F.SetBlockAttrs,{id:t.documentID,attrs:a})}checkAttrFormat(e,t=!1){if(e.value=String(e.value),t){if(""==e.name.trim())return G.z8.warning("请输入字段名"),!1;if(""==e.value.trim())return G.z8.warning("请输入字段值"),!1}const a=/^[a-z0-9]+[-_]?[a-z0-9-_]*$/;return!(!a.test(e.name.trim())&&e.name)||(G.z8.warning(`${e.name}: 字段名格式不正确`),!1)}appendAttr(e="create",t=this){"create"==e?t.createAttrs.push({name:"",label:"",type:"text",order:99,value:""}):t.selectAttrs.push({name:"",label:"",type:"text",order:99,value:""})}async removeAttr(e,t,a=this){if(-1==e.name.indexOf("custom"))return;const l={},n=e.name.replaceAll("_","-");l[n]="";const o=await X(F.SetBlockAttrs,{id:this.documentID,attrs:l});0==o.code&&a.attributes.splice(t,1)}async saveNewAttr(e,t,a,l=this){if(console.log(e,a,t),!l.checkAttrFormat(a,!0))return;"number"==typeof a.value&&(a.value=String(a.value)),a.label=""==a.label.trim()?a.name:a.label,"multi_select"==a.type&&(a.value=a.value.replaceAll("，",",")),"create"==e&&-1==a.name.indexOf("custom-")&&(a.name="custom-"+a.name);const n=a.name.replaceAll("_","-").trim();a.order=l.attributes.length+1;const o={};o[n]=a.value.trim(),console.log(o);const r=await X(F.SetBlockAttrs,{id:l.documentID,attrs:o});-1!=r.code?(a.name=a.name.replaceAll("-","_"),l.attributes.push(a),l.saveAttrsOrder(),await Me.shared_attrs.put({name:a.name,label:a.label,type:a.type}),"create"==e?l.createAttrs.splice(t,1):l.selectAttrs.splice(t,1)):G.z8.warning(r.msg)}async selectAttrName(e,t,a=this){const l=a.sharedAttrs.find((t=>t.name===e.name));l&&(a.selectAttrs[t].type=l.type,a.selectAttrs[t].label=l.label)}async appendSelectItem(e,t){e.value=e.value?e.value+","+t:t,this.saveAttrValue(e)}async removeSelectItem(e,t,a=this){const l=ae(e.value);console.log(l),l.indexOf(t)>-1&&(l.splice(l.indexOf(t),1),e.value=l.join(","),console.log(e),a.saveAttrValue(e,a))}async downloadAttrs(e=this){console.log("downloadAttrs");let t="";for(const a in e.attributes){const l=e.attributes[a];t+=`**${l.label||l.name}:** ${l.value}\n\n`}console.log(t),X(F.PrependBlock,{data:t,dataType:"markdown",parentID:e.documentID})}}const Se={text:'<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 14 14"  style="display: block; fill: #666; flex-shrink: 0; backface-visibility: hidden;"><path d="M7,4.56818 C7,4.29204 6.77614,4.06818 6.5,4.06818 L0.5,4.06818 C0.223858,4.06818 0,4.29204 0,4.56818 L0,5.61364 C0,5.88978 0.223858,6.11364 0.5,6.11364 L6.5,6.11364 C6.77614,6.11364 7,5.88978 7,5.61364 L7,4.56818 Z M0.5,1 C0.223858,1 0,1.223858 0,1.5 L0,2.54545 C0,2.8216 0.223858,3.04545 0.5,3.04545 L12.5,3.04545 C12.7761,3.04545 13,2.8216 13,2.54545 L13,1.5 C13,1.223858 12.7761,1 12.5,1 L0.5,1 Z M0,8.68182 C0,8.95796 0.223858,9.18182 0.5,9.18182 L11.5,9.18182 C11.7761,9.18182 12,8.95796 12,8.68182 L12,7.63636 C12,7.36022 11.7761,7.13636 11.5,7.13636 L0.5,7.13636 C0.223858,7.13636 0,7.36022 0,7.63636 L0,8.68182 Z M0,11.75 C0,12.0261 0.223858,12.25 0.5,12.25 L9.5,12.25 C9.77614,12.25 10,12.0261 10,11.75 L10,10.70455 C10,10.4284 9.77614,10.20455 9.5,10.20455 L0.5,10.20455 C0.223858,10.20455 0,10.4284 0,10.70455 L0,11.75 Z"></path></svg>',checkbox:'<svg xmlns="http://www.w3.org/2000/svg" version="1.1"  viewBox="0 0 14 14"  style="display: block; fill: #666; flex-shrink: 0; backface-visibility: hidden;"><path d="M0,3 C0,1.34314 1.34326,0 3,0 L11,0 C12.6567,0 14,1.34314 14,3 L14,11 C14,12.6569 12.6567,14 11,14 L3,14 C1.34326,14 0,12.6569 0,11 L0,3 Z M3,1.5 C2.17139,1.5 1.5,2.17157 1.5,3 L1.5,11 C1.5,11.8284 2.17139,12.5 3,12.5 L11,12.5 C11.8286,12.5 12.5,11.8284 12.5,11 L12.5,3 C12.5,2.17157 11.8286,1.5 11,1.5 L3,1.5 Z M2.83252,6.8161 L3.39893,6.27399 L3.57617,6.10425 L3.92334,5.77216 L4.26904,6.10559 L4.44531,6.27582 L5.58398,7.37402 L9.28271,3.81073 L9.45996,3.64008 L9.80664,3.3056 L10.1538,3.63989 L10.3311,3.81067 L10.8936,4.35303 L11.0708,4.52399 L11.4434,4.88379 L11.0708,5.24353 L10.8936,5.41437 L6.1084,10.0291 L5.93115,10.2 L5.58398,10.5344 L5.23682,10.2 L5.05957,10.0292 L2.83057,7.87946 L2.65283,7.70801 L2.27832,7.34674 L2.6543,6.98694 L2.83252,6.8161 Z"></path></svg>',number:'<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 14 14"  style="display: block; fill: #666; flex-shrink: 0; backface-visibility: hidden;"><path d="M4.46191,0 C3.8667,0 3.38428,0.482422 3.38428,1.07751 L3.38428,3.38425 L1.07764,3.38425 C0.482422,3.38425 0,3.86667 0,4.46179 C0,5.05688 0.482422,5.53931 1.07764,5.53931 L3.38428,5.53931 L3.38428,8.46063 L1.07764,8.46063 C0.482422,8.46063 0,8.94308 0,9.53818 C0,10.1333 0.482422,10.6157 1.07764,10.6157 L3.38428,10.6157 L3.38428,12.9224 C3.38428,13.5175 3.8667,13.9999 4.46191,13.9999 C5.05664,13.9999 5.53906,13.5175 5.53906,12.9224 L5.53906,10.6157 L8.46045,10.6157 L8.46045,12.9224 C8.46045,13.5175 8.94287,13.9999 9.53809,13.9999 C10.1333,13.9999 10.6157,13.5175 10.6157,12.9224 L10.6157,10.6157 L12.9224,10.6157 C13.5176,10.6157 14,10.1333 14,9.53818 C14,8.94308 13.5176,8.46063 12.9224,8.46063 L10.6157,8.46063 L10.6157,5.53931 L12.9224,5.53931 C13.5176,5.53931 14,5.05688 14,4.46179 C14,3.86667 13.5176,3.38425 12.9224,3.38425 L10.6157,3.38425 L10.6157,1.07751 C10.6157,0.482422 10.1333,0 9.53809,0 C8.94287,0 8.46045,0.482422 8.46045,1.07751 L8.46045,3.38425 L5.53906,3.38425 L5.53906,1.07751 C5.53906,0.482422 5.05664,0 4.46191,0 Z M5.53906,8.46063 L5.53906,5.53931 L8.46045,5.53931 L8.46045,8.46063 L5.53906,8.46063 Z"></path></svg>',date:'<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 14 14"  style=" display: block; fill: #666; flex-shrink: 0; backface-visibility: hidden;"><path d="M10.8889,5.5 L3.11111,5.5 L3.11111,7.05556 L10.8889,7.05556 L10.8889,5.5 Z M12.4444,1.05556 L11.6667,1.05556 L11.6667,0 L10.1111,0 L10.1111,1.05556 L3.88889,1.05556 L3.88889,0 L2.33333,0 L2.33333,1.05556 L1.55556,1.05556 C0.692222,1.05556 0.00777777,1.75556 0.00777777,2.61111 L0,12.5 C0,13.3556 0.692222,14 1.55556,14 L12.4444,14 C13.3,14 14,13.3556 14,12.5 L14,2.61111 C14,1.75556 13.3,1.05556 12.4444,1.05556 Z M12.4444,12.5 L1.55556,12.5 L1.55556,3.94444 L12.4444,3.94444 L12.4444,12.5 Z M8.55556,8.61111 L3.11111,8.61111 L3.11111,10.1667 L8.55556,10.1667 L8.55556,8.61111 Z"></path></svg>',drag:'<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 10 10" style="display: block; fill: rgba(55, 53, 47, 0.45); flex-shrink: 0; backface-visibility: hidden;"><path d="M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z"></path></svg>',select:'<svg viewBox="0 0 14 14" style="width: 14px; height: 14px; display: block; fill: rgba(55, 53, 47, 0.45); flex-shrink: 0; backface-visibility: hidden;"><path d="M7,13 C10.31348,13 13,10.31371 13,7 C13,3.68629 10.31348,1 7,1 C3.68652,1 1,3.68629 1,7 C1,10.31371 3.68652,13 7,13 Z M3.75098,5.32278 C3.64893,5.19142 3.74268,5 3.90869,5 L10.09131,5 C10.25732,5 10.35107,5.19142 10.24902,5.32278 L7.15771,9.29703 C7.07764,9.39998 6.92236,9.39998 6.84229,9.29703 L3.75098,5.32278 Z"></path></svg>',multi_select:'<svg viewBox="0 0 14 14"  style="width: 14px; height: 14px; display: block; fill: rgba(55, 53, 47, 0.45); flex-shrink: 0; backface-visibility: hidden;"><path d="M4,3 C4,2.447715 4.447715,2 5,2 L12,2 C12.5523,2 13,2.447716 13,3 C13,3.55228 12.5523,4 12,4 L5,4 C4.447715,4 4,3.55228 4,3 Z M4,7 C4,6.447715 4.447715,6 5,6 L12,6 C12.5523,6 13,6.447716 13,7 C13,7.55228 12.5523,8 12,8 L5,8 C4.447715,8 4,7.55228 4,7 Z M4,11 C4,10.447715 4.447715,10 5,10 L12,10 C12.5523,10 13,10.447716 13,11 C13,11.55228 12.5523,12 12,12 L5,12 C4.447715,12 4,11.55228 4,11 Z M2,4 C1.44771525,4 1,3.55228475 1,3 C1,2.44771525 1.44771525,2 2,2 C2.55228475,2 3,2.44771525 3,3 C3,3.55228475 2.55228475,4 2,4 Z M2,8 C1.44771525,8 1,7.55228475 1,7 C1,6.44771525 1.44771525,6 2,6 C2.55228475,6 3,6.44771525 3,7 C3,7.55228475 2.55228475,8 2,8 Z M2,12 C1.44771525,12 1,11.5522847 1,11 C1,10.4477153 1.44771525,10 2,10 C2.55228475,10 3,10.4477153 3,11 C3,11.5522847 2.55228475,12 2,12 Z"></path></svg>',rate:'<svg viewBox="0 0 32 32" style="width: 14px; height: 14px; display: block; fill: rgba(55, 53, 47, 0.45); flex-shrink: 0; backface-visibility: hidden;">\n  <path d="M15.1203 1.70752C15.3972 0.855311 16.6028 0.85531 16.8797 1.70752L19.8336 10.7985C19.9574 11.1797 20.3126 11.4377 20.7133 11.4377H30.2722C31.1682 11.4377 31.5408 12.5843 30.8159 13.111L23.0826 18.7296C22.7584 18.9651 22.6227 19.3826 22.7466 19.7638L25.7004 28.8548C25.9773 29.707 25.0019 30.4157 24.277 29.889L16.5437 24.2704C16.2195 24.0349 15.7805 24.0349 15.4563 24.2704L7.72302 29.889C6.99809 30.4157 6.02269 29.707 6.29959 28.8548L9.25344 19.7638C9.37727 19.3827 9.24162 18.9651 8.91742 18.7296L1.18414 13.111C0.459205 12.5843 0.831771 11.4377 1.72784 11.4377H11.2867C11.6874 11.4377 12.0426 11.1797 12.1664 10.7985L15.1203 1.70752Z" />\n  </svg>  ',dots:'<svg viewBox="0 0 13 3" style="width: 12px; height: 100%; display: block; fill: rgba(55, 53, 47, 0.45); flex-shrink: 0; backface-visibility: hidden;"><g><path d="M3,1.5A1.5,1.5,0,1,1,1.5,0,1.5,1.5,0,0,1,3,1.5Z"></path><path d="M8,1.5A1.5,1.5,0,1,1,6.5,0,1.5,1.5,0,0,1,8,1.5Z"></path><path d="M13,1.5A1.5,1.5,0,1,1,11.5,0,1.5,1.5,0,0,1,13,1.5Z"></path></g></svg>',img:'<svg t="1650509052121" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2067" xmlns:xlink="http://www.w3.org/1999/xlink" style="width: 14px; height: 14px; display: block; fill: rgba(55, 53, 47, 0.45); flex-shrink: 0; backface-visibility: hidden;"><path d="M867.90864 574.538232V257.779543a50.844091 50.844091 0 0 0-50.844092-50.844091h-610.129096a50.844091 50.844091 0 0 0-50.844092 50.844091v499.797418l430.141013-257.779543a152.532274 152.532274 0 0 1 157.108243 0z m0 118.466733l-177.445879-106.264151a50.844091 50.844091 0 0 0-50.844092 0L254.220457 817.064548h562.844091a50.844091 50.844091 0 0 0 50.844092-50.844091z m-660.973188-587.757696h610.129096a152.532274 152.532274 0 0 1 152.532274 152.532274v508.440914a152.532274 152.532274 0 0 1-152.532274 152.532274h-610.129096a152.532274 152.532274 0 0 1-152.532274-152.532274v-508.440914a152.532274 152.532274 0 0 1 152.532274-152.532274z m127.110228 355.90864a76.266137 76.266137 0 1 1 76.266137-76.266137 76.266137 76.266137 0 0 1-76.266137 76.266137z" fill="#666666" p-id="2068"></path></svg>'};var De=a(8249),Oe=a(6598),Ze=(0,o.aZ)({name:"App",components:{draggable:De.J},data(){return{widget:{},icons:Se,ElIcons:Oe,Utils:l,Config:J,selectOption:{index:-1,value:""}}},computed:{attrsSelectOptions(){const e=[];return this.widget.sharedAttrs.forEach((t=>{const a=this.widget.attributes.find((e=>e.name==t.name));!a&&t.name.indexOf("custom")>-1&&e.push(t)})),e}},methods:{showSelectInput(e){console.log(e),this.selectOption.index=e},appendSelectItem(e){this.widget.appendSelectItem(e,this.selectOption.value),this.selectOption.index=-1,this.selectOption.value=""},randomColor(){const e=Math.floor(8*Math.random())+0,t=J.tag_colors[e]["name"];return"grey"==t?"blue":t},resizeIframe(){const e=window.frameElement,t=window.document.body.scrollHeight;e.style.height=t+50+"px"}},created(){this.widget=new Ue,this.widget.init()},mounted(){setTimeout((()=>{this.resizeIframe()}),800)}}),Te=a(89);const Ie=(0,Te.Z)(Ze,[["render",q]]);var je=Ie,Be=a(8944),Ye=(a(4415),a(812));(0,n.ri)(je).use(Be.Z,{locale:Ye.Z}).mount("#app")}},t={};function a(l){var n=t[l];if(void 0!==n)return n.exports;var o=t[l]={exports:{}};return e[l].call(o.exports,o,o.exports,a),o.exports}a.m=e,function(){var e=[];a.O=function(t,l,n,o){if(!l){var r=1/0;for(c=0;c<e.length;c++){l=e[c][0],n=e[c][1],o=e[c][2];for(var s=!0,i=0;i<l.length;i++)(!1&o||r>=o)&&Object.keys(a.O).every((function(e){return a.O[e](l[i])}))?l.splice(i--,1):(s=!1,o<r&&(r=o));if(s){e.splice(c--,1);var d=n();void 0!==d&&(t=d)}}return t}o=o||0;for(var c=e.length;c>0&&e[c-1][2]>o;c--)e[c]=e[c-1];e[c]=[l,n,o]}}(),function(){a.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(t,{a:t}),t}}(),function(){a.d=function(e,t){for(var l in t)a.o(t,l)&&!a.o(e,l)&&Object.defineProperty(e,l,{enumerable:!0,get:t[l]})}}(),function(){a.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){a.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){var e={143:0};a.O.j=function(t){return 0===e[t]};var t=function(t,l){var n,o,r=l[0],s=l[1],i=l[2],d=0;if(r.some((function(t){return 0!==e[t]}))){for(n in s)a.o(s,n)&&(a.m[n]=s[n]);if(i)var c=i(a)}for(t&&t(l);d<r.length;d++)o=r[d],a.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return a.O(c)},l=self["webpackChunknote_attrs"]=self["webpackChunknote_attrs"]||[];l.forEach(t.bind(null,0)),l.push=t.bind(null,l.push.bind(l))}();var l=a.O(void 0,[998],(function(){return a(9264)}));l=a.O(l)})();