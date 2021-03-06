class Disk3D {
    constructor(data, number, cicleTwoData, cicleOneData, cilcleNum) {
      this.data = data;
      this.cicleTwoData = cicleTwoData; // 第二圈数据
      this.cicleOneData = cicleOneData; // 第一圈数据
      this.number = number; // 最外层小球一共有多少数据
      this.cilcleNum = cilcleNum; // cicleNum是圆形平面类型数量
      this.middleRadius = 400; // 最大圆半径,小球环绕的最外层看不到的圆
      this.cicleRadius = 340; // 饼图圆
      this.defaultAngle = 0; // 每个环绕小球的夹角
      this.eachRadian = 0; // 每个环绕小球的夹角 弧度
      this.width = 0;  // 场景宽
      this.height = 0; // 场景高
      this.renderer = null; // 渲染器
      this.scene = null; // 场景
      this.sceneScale = {x: 1, y: 1, z: 1};  // 场景缩放比例
      this.cameraY = 200; // 相机的y轴位置
      this.cameraZ = 500; // 相机的z轴位置
      this.camera = null;
      this.centerSphere = null; // 底部正中间小球
      this.centerPoint = { x: 0, y: -330, z: 0 }; // 底部正中间小球中心点
      this.colors = ['#c5974a', '#bc5a5e', '#4ca96f' ]; 
      this.hasPosData = []; // 最外层小球的位置
      this.textGroup = new THREE.Object3D(); // 文字组合
      this.lineGroup = new THREE.Object3D(); // 线段组合
      this.pointGroup = new THREE.Object3D(); // 旋转组合
      this.pieGroup = new THREE.Object3D(); // 原形的饼状组合
      this.threeText = new THREE.Group(); // 原形的饼状组合
      this.threeText.name = 'wenzi';
      this.originAngle = 0; // 分隔竖线的角度
      this.clock = null;
      this.orbitControl = null;
      this.spriteMaterialGroup = [];
      this.spriteMaterialGroupLength = 0;
      this.n = 0;
    }
  
    init(){
        this.getWidHeight();
        this.adaptiveResolution();
        this.drawScene();
        this.drawCamera();
        this.drawLight();
        this.drawCenter();
        this.drawCicleFact();
        this.getPosPoint();
        this.drawCilcle();
        this.drawRenderer();
        this.orbitControlFun();
        this.animate();

    }
    getWidHeight(){
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }
    adaptiveResolution(){
        if(this.width < 1440){
            this.sceneScale = {x: 0.8, y: 0.8, z: 0.8};
        }
    }
    drawScene() {
       this.scene = new THREE.Scene();
       window.scene = this.scene;
        this.scene.scale.set(this.sceneScale.x, this.sceneScale.y, this.sceneScale.z);
    }
    drawCamera() {
        window.camera =  this.camera = new THREE.OrthographicCamera(this.width / - 2, 
            this.width / 2, this.height / 2, this.height / - 2, 0.1, 1000);
        // this.camera.position.x = 0;
        // this.camera.position.y = this.cameraY; // -140
        // this.camera.position.z = this.cameraZ; // 300
        this.camera.position.set(0, 212, 433);
        // 坐标轴调试用的
        let axes = new THREE.AxesHelper(280);
        axes.position.set(0, 1, 0);
        this.scene.add(axes);
    }
    /**
     * 绘制光
     */
    drawLight(){
        // 绘制聚光灯光
        // var spotLight = new THREE.SpotLight( '#fff', 0.1);
        // spotLight.position.set( 100, -1400, 100 );
        
        // spotLight.castShadow = true;
        // spotLight.shadow.camera.near = 30;
        // spotLight.shadow.camera.far = 1000;
        // spotLight.shadow.camera.fov = 100;
        // spotLight.castShadow = true;
        // this.scene.add( spotLight );
        let ambientLight = new THREE.AmbientLight('#fff');
        this.scene.add( ambientLight );
    }
    /**
     * @desc 绘制中心点小球
     */
    drawCenter() {
        // 设置球体的值
        let radius = 1, segemnt = 8, rings = 8;
        let sphereGeometry = new THREE.SphereGeometry(radius, segemnt, rings);
        let sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xbc5a5e });
        this.centerSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        let { x, y, z } = this.centerPoint;
        this.centerSphere.position.x = x;
        this.centerSphere.position.y = y;
        this.centerSphere.position.z = z;
        this.scene.add(this.centerSphere);
    }
    /**
     * @desc 绘制实线圆形
     */
    drawCicleFact(){
        // 圆型 白线 实线
        let materialLine = new THREE.LineBasicMaterial( { color: '#8b9199', opacity: 0.1 } );
        let radius = 226;
        let segments = 620; //<-- Increase or decrease for more resolution I guess
        let circleGeometryLine = new THREE.CircleGeometry( radius, segments );    
        circleGeometryLine.rotateX(Math.PI/2)

        // Remove center vertex
        circleGeometryLine.vertices.shift();
        let line = new THREE.Line( circleGeometryLine, materialLine );
        this.scene.add( line );
    }
    /**
     * 求出每个小球的位置
     */
    getPosPoint(){
        // 求出每个小球之间的角度
        let splitAngle = +(360 / this.number).toFixed(2);
        this.defaultAngle = splitAngle;
        this.eachRadian =  Math.PI * 2 / this.number;
        this.data.map((val, i) => {
             val.map((item) => {
                splitAngle += this.defaultAngle;
                let { x, y, z } = this.italicLineGenerate(splitAngle, false, this.middleRadius);
                this.hasPosData.push({ name: item, x, y, z, color: this.colors[i]});
             })
        })
        // 连线小球与底部中心点小球
        this.lineToCenterBtmBall();
    }
    /**
    * @desc 绘制线
    */
    lineToCenterBtmBall(){
        let lineAnimateArr = [];
        // let lineCurve = [];
        let material = new THREE.LineBasicMaterial( { color: '#8b9199', opacity: 0.1 } );
        for(let i = 0; i < this.number; i++){
            let eachPoint = this.hasPosData[i];
            let p0 = new THREE.Vector3(this.centerPoint.x, this.centerPoint.y, this.centerPoint.z);
            let p1 = new THREE.Vector3(eachPoint.x, eachPoint.y, eachPoint.z);
            let curve = new THREE.CatmullRomCurve3([p1, p0]);
            // lineCurve.push(curve);
            let geometry = new THREE.Geometry();
            geometry.vertices = curve.getPoints(1);
            let line = new THREE.Line(geometry, material);
            this.lineGroup.add(line);
            // 绘制小球
            let radius = 5, segemnt = 16, rings = 16;
            let sphereGeometry = new THREE.SphereGeometry(radius, segemnt, rings);
            var sphereMaterial = new THREE.MeshLambertMaterial({ color: eachPoint.color, transparent: true });
            
            let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.x = eachPoint.x;
            sphere.position.y = eachPoint.y;
            sphere.position.z = eachPoint.z;
            this.pointGroup.add(sphere);
            // 绘制文字
            this.textGroup.add(this.drawText(eachPoint, i));
        }
        this.spriteMaterialGroupLength = this.spriteMaterialGroup.length;
        this.scene.add(this.textGroup);
        this.scene.add(this.lineGroup);
        this.scene.add(this.pointGroup);
    }
    /**
     * 
     * @param {*} eachPoint 文字坐标轴位置，名字
     */
    drawText(eachPoint, i){
        let canvasWidth = 356;
        let canvasHeight = 128;
        let textFontsize = 120;
        let scale = null;
        let name = eachPoint.name;
        let nameLenght = name.length;
        let locationX = eachPoint.x;
        let locationY = eachPoint.y;
        let locationZ = eachPoint.z;
        if(nameLenght === 2){
            textFontsize = 125;
            let x = 0.28;
            scale = {x: x, y: x / 2, z: 1.25 * x};
            locationX = locationX > 0 ? (locationX - 6) : (locationX + 6);
            locationZ = locationZ > 0 ? (locationZ - 6) : (locationZ + 6);
        }else if(nameLenght === 3){
            textFontsize = 85;
            let x = 0.6;
            scale = {x: x, y: x / 2, z: 1.25 * x};
        }else if(nameLenght === 4){
            textFontsize = 65;
            let x = 1;
            scale = {x: x, y: x / 2, z: 1.25 * x};
            locationX = locationX > 0 ? (locationX + 8) : (locationX - 8);
            locationZ = locationZ > 0 ? (locationZ + 8) : (locationZ - 8);
        }else if(nameLenght === 5){
            textFontsize = 51;
            let x = 1.50;
            scale = {x: x, y: x / 2, z: 1.25 * x};
            locationX = locationX > 0 ? (locationX + 22) : (locationX - 22);
            locationZ = locationZ > 0 ? (locationZ + 15) : (locationZ - 15);
        }else if(nameLenght === 6){
            textFontsize = 40;
            let x = 2.6;
            scale = {x: x, y: x / 2, z: 1.25 * x};
            locationX = locationX > 0 ? (locationX + 22) : (locationX - 22);
            locationZ = locationZ > 0 ? (locationZ + 15) : (locationZ - 15);
        }else{
            textFontsize = 34;
            let x = 3.6;
            scale = {x: x, y: x / 2, z: 1.25 * x};
            locationX = locationX > 0 ? (locationX + 32) : (locationX - 32);
            locationZ = locationZ > 0 ? (locationZ + 35) : (locationZ - 35);
        }
        let radian = this.eachRadian * i;
        // 创建文字
        let rotation = Math.PI * 3 / 2 * radian;
        let spriteMaterialColor = eachPoint.color;
        // console.log(rotation);
        
        var text = this.makeTextSprite(name, scale, spriteMaterialColor, { fontsize: textFontsize, width: canvasWidth, height: canvasHeight}, rotation);
        text.position.set(locationX, locationY, locationZ);
        return text;
    }
        /**
     * 创建永远面向相机的2D文字
     * */
    makeTextSprite(message, scale, spriteMaterialColor, parameters, rotation) {
        if (parameters === undefined) {
            parameters = {};
        }
        var fontface = parameters.hasOwnProperty('fontface') ? parameters['fontface'] : 'Microsoft YaHei';
        var fontsize = parameters.hasOwnProperty('fontsize') ? parameters['fontsize'] : 100;
        var borderThickness = parameters.hasOwnProperty('borderThickness') ? parameters['borderThickness'] : 0;
        var textColor = parameters.hasOwnProperty('textColor') ? parameters['textColor'] : { r: 255, g: 255, b: 255, a: 1.0 };
        scale = scale ? scale : {x: 0.5, y: 0.25, z: 0.75};

        var canvasWidth = parameters.hasOwnProperty('width') ? parameters['width'] : '512';
        var canvasHeight = parameters.hasOwnProperty('height') ? parameters['height'] : '256';

        var canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 200;
        canvas.style.width = '200px';
        canvas.style.height = '200px';
        var context = canvas.getContext('2d');
        context.font = 'bold ' + 16 + 'px ' + fontface;

        context.lineWidth = borderThickness;
        context.textAlign = 'left';
        context.fillStyle = 'rgba(' + textColor.r + ', ' + textColor.g + ', ' + textColor.b + ', 1.0)'; 
        context.fillText(message, borderThickness, fontsize + borderThickness);

        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        texture.minFilter = THREE.LinearFilter;
        var spriteMaterial = new THREE.SpriteMaterial({ map: texture, color: spriteMaterialColor}); // color: '#ffffff'
        this.spriteMaterialGroup.push(spriteMaterial);
        var sprite = new THREE.Sprite(spriteMaterial);
        // sprite.material.map.center.set(0.5, 0.5);

        sprite.scale.set(400, 200, 1);
        return sprite;
    }
    /**
     * 根据角度以及半径 ，求出当前点xy的坐标
     * @param {*} angle 角度
     * @param {*} onlyXy 是否包含z轴
     * @param {*} radius 圆的半径
     */
    italicLineGenerate(angle, onlyXy, radius){
        if(onlyXy){
            let x = +(Math.cos(angle * (Math.PI / 180)) * radius).toFixed(2);
            let y = +(Math.sin(angle * (Math.PI / 180)) * radius).toFixed(2);
            return {x, y};
        }
        let x = +(Math.cos(angle * (Math.PI / 180)) * radius).toFixed(2);
        let z = +(Math.sin(angle * (Math.PI / 180)) * radius).toFixed(2);
        return {x, y: 0, z};
    }
    // 画出不同扇区的圆
    drawCilcle(){
        let originAngle = 0, circleGeometry, circleMaterial, circle;
        this.data.map((val, i) => {
            let count = val.length;
            // 当前类型占整个圆的占比
            let proportion = count / this.number;
            let angle = Math.PI * 2 * proportion;
            circleGeometry = new THREE.CircleGeometry( this.cicleRadius, 60, originAngle, angle );
            circleMaterial = new THREE.MeshBasicMaterial( { color:  this.colors[i] } );
            circle = new THREE.Mesh( circleGeometry, circleMaterial );
             // 求出第一圈类型文字位置
            this.drawTypeOnetext(angle / 2 + originAngle, i);
            // this.drawTypeOnetext.push()
            originAngle += angle;
            this.pieGroup.add(circle);
            // 求出类型的分隔线
            this.pieGroup.add(this.splitLine(originAngle, false, this.cicleRadius));
            // 求出最外圈竖线分割线
            this.splitVerticalLine(angle, i);
            
        })
        this.pieGroup.rotateX(-Math.PI / 2);
        // this.pieGroup.rotateZ(166);
        this.scene.add(this.pieGroup);
        this.scene.add(this.threeText);
    }
    /**
     * 求出第一圈类型文字位置
     * @param {*} angle 角度
     * @param {*} i 索引
     */
    drawTypeOnetext(angle, i){
        let text = this.cicleOneData[i];
        var canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        var context = canvas.getContext('2d');
        context.font = 12 + 'px ';
        context.textAlign = 'left';
        context.fillStyle = 'rgba(255, 255, 255, 1.0)'; 
        context.fillText(text, 0, 12);
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        texture.minFilter = THREE.LinearFilter;
        var spriteMaterial = new THREE.SpriteMaterial({ map: texture, color: '#fff', rotation: Math.PI * 2}); // color: '#ffffff'
        this.spriteMaterialGroup.push(spriteMaterial);
        var sprite = new THREE.Sprite(spriteMaterial);

        // 为3个文字配置位置
        var positionS = [[100, 10, -80], [-100, 10, -80], [10, 10, 90]]

        sprite.position.set(...positionS[i]); // 为文字设置位置 高度y为10 避免与圆形平面相交遮挡
        sprite.scale.set(180, 180, 180);
        this.threeText.add(sprite);
    }
    /**
     * @param {number} angle 每个竖线所对应的夹角 
     */
    splitVerticalLine(angle, i){
        // 每个扇形区分出多少份，求出夹角
        let splitAngle = angle / this.cicleTwoData[i].length;
        this.cicleTwoData[i].map(() => {
            this.originAngle += splitAngle;
            this.pieGroup.add(this.splitLine(this.originAngle, true, this.cicleRadius));
        })
    }
    /**
     * 
     * @param {number} angle 角度
     *  @param {number} isOriginalLine 是否是从圆点开始连接的
     * @param {number} radius 半径
     */
    splitLine(angle, isOriginalLine, radius){
        var geometry = new THREE.Geometry();
        let transformAn = 180 / Math.PI * angle;
        if(isOriginalLine){
            let point0 = this.italicLineGenerate(transformAn, true, 226);
            let point1 = this.italicLineGenerate(transformAn, true, radius);
            geometry.vertices.push(
                new THREE.Vector3( point0.x, point0.y, 0 ),
                new THREE.Vector3( point1.x, point1.y, 0 )
            );
        }else{
            let { x, y } = this.italicLineGenerate(transformAn, true, radius);
            geometry.vertices.push(
                new THREE.Vector3( 0, 0, 0 ),
                new THREE.Vector3( x, y, 0 )
            );
        }
        var material = new THREE.MeshBasicMaterial( { color: 0xffffff} );
        var line = new THREE.Line(geometry, material);
        return line;
    }
    /**
     * 初始化renderer
     */
    drawRenderer() {// WebGLRenderer CanvasRenderer
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        this.renderer.setClearColor(0x08172D);
        this.renderer.setSize(this.width, this.height);
        document.body.appendChild(this.renderer.domElement);
        this.renderer.render(this.scene, this.camera);
        
    }
        /**
     * @desc 绘制实线圆形
     */
    orbitControlFun() {
        // console.log(this.renderer);
        
        // 盘旋控制
        this.orbitControl = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControl.minDistrance = 0;
        this.orbitControl.maxDistrance = 0;
        this.orbitControl.enableZoom = true;
        this.orbitControl.enabled = true;
        this.orbitControl.maxPolarAngle = Math.PI / 2;
    }
    animate(that) {
        let animateDeg = 0.002;
        this.n = this.n + animateDeg;
        this.renderer.render(this.scene, this.camera);
        if (this.n > Math.PI * 2) {
            this.n = this.n - Math.PI * 2;
        }
        // this.revisesTextLoacation(this.n);
        this.scene.rotation.y -= animateDeg;
        requestAnimationFrame(this.animate.bind(this));
    }
    revisesTextLoacation(rt) {
        let jg = parseInt(rt / this.eachRadian, 10);
        for (let i = 0; i < this.spriteMaterialGroupLength; i++) {
            let radian = this.eachRadian * i;

            let rotation = Math.PI * 3 / 2 + radian;
            let halfLength = parseInt(this.spriteMaterialGroupLength / 2, 10);
            if (jg < halfLength) {
                if (i > (jg - 1) && i < (halfLength + jg)) {
                    this.spriteMaterialGroup[i].rotation = rotation - rt;
                } else {
                    this.spriteMaterialGroup[i].rotation = rotation - rt - Math.PI;
                }
            } else {
                if (i > (jg - halfLength) && i < jg) {
                    this.spriteMaterialGroup[i].rotation = rotation - rt - Math.PI;
                } else {
                    this.spriteMaterialGroup[i].rotation = rotation - rt;
                }
            }
        }
    }
}