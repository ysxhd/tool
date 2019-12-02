class Disk3D {
    constructor(data, number) {
      this.data = data;
      this.number = number; // 最外层一共有多少数据
      this.middleRadius = 400; // 最大圆半径,小球环绕的最外层看不到的圆
      this.cicleRadius = 340; // 饼图圆
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
      this.lineGroup = new THREE.Object3D(); // 线段组合
      this.pointGroup = new THREE.Object3D(); // 旋转组合
      this.pieGroup = new THREE.Object3D(); // 原形的饼状组合
      this.clock = null;
      this.orbitControl = null;
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
        this.scene.scale.set(this.sceneScale.x, this.sceneScale.y, this.sceneScale.z);
    }
    drawCamera() {
        this.camera = new THREE.OrthographicCamera(this.width / - 2, 
            this.width / 2, this.height / 2, this.height / - 2, 0.1, 1000);
        this.camera.position.x = 0;
        this.camera.position.y = this.cameraY; // -140
        this.camera.position.z = this.cameraZ; // 300
        // 坐标轴调试用的
        // let axes = new THREE.AxisHelper(280);
        // this.scene.add(axes);
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
        let materialLine = new THREE.LineBasicMaterial( { color: 0xffffff } );
        let radius = 226;
        let segments = 620; //<-- Increase or decrease for more resolution I guess
        let circleGeometryLine = new THREE.CircleGeometry( radius, segments );    
        circleGeometryLine.rotateX(Math.PI/2)

        // Remove center vertex
        circleGeometryLine.vertices.shift();
        let line = new THREE.Line( circleGeometryLine, materialLine );
        this.scene.add( new THREE.Line( circleGeometryLine, materialLine ) );
    }
    /**
     * 求出每个小球的位置
     */
    getPosPoint(){
        // 求出每个小球之间的角度
        let splitAngle = +(360 / this.number).toFixed(2);
        let defaultAngle = splitAngle;
        this.data.map((val, i) => {
             val.map((item) => {
                splitAngle += defaultAngle;
                let { x, y, z } = this.italicLineGenerate(splitAngle);
                this.hasPosData.push({ name: item, x: x, y, z, color: this.colors[i]});
                // this.hasPosBallData.push({ name: item, x, y, z, color: this.colors[i]}); // 小球的位置
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
            var sphereMaterial = new THREE.MeshLambertMaterial({ color: eachPoint.color });
            
            let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.x = eachPoint.x;
            sphere.position.y = eachPoint.y;
            sphere.position.z = eachPoint.z;
            this.pointGroup.add(sphere);
        }
        this.scene.add(this.lineGroup);
        this.scene.add(this.pointGroup);
    }
    /**
     * 根据角度以及半径 ，求出当前点xy的坐标
     * @param {*} angle 角度
     * @param {*} onlyXy 是否包含z轴
     */
    italicLineGenerate(angle, onlyXy){
        if(onlyXy){
            let x = +(Math.cos(angle * (Math.PI / 180)) * this.cicleRadius).toFixed(2);
            let y = +(Math.sin(angle * (Math.PI / 180)) * this.cicleRadius).toFixed(2);
            return {x, y};
        }
        let x = +(Math.cos(angle * (Math.PI / 180)) * this.middleRadius).toFixed(2);
        let z = +(Math.sin(angle * (Math.PI / 180)) * this.middleRadius).toFixed(2);
        return {x, y: 0, z};
    }
    drawCilcle(){
        let originAngle = 0, circleGeometry, circleMaterial, circle;
        this.data.map((val, i) => {
            let count = val.length;
            // 当前类型占整个圆的占比
            let proportion = count / this.number;
            let angle = Math.PI * proportion * 2;
            circleGeometry = new THREE.CircleGeometry( this.cicleRadius, 60, originAngle, angle );
            circleMaterial = new THREE.MeshBasicMaterial( { color:  this.colors[i] } );
            circle = new THREE.Mesh( circleGeometry, circleMaterial );
            originAngle += angle;
            this.pieGroup.add(circle);
            // 求出类型的分隔线
            this.pieGroup.add(this.splitLine(originAngle));
        })
        console.log(this.data);
        this.pieGroup.rotateX(-Math.PI / 2);
        this.scene.add(this.pieGroup);
    }
    /**
     * 
     * @param {number} angle 角度
     */
    splitLine(angle){
        console.log(angle );
        var geometry = new THREE.Geometry();
        let transformAn = 180 / Math.PI * angle;
        console.log(transformAn);
        let { x, y } = this.italicLineGenerate(transformAn, true);
        geometry.vertices.push(
            new THREE.Vector3( 0, 0, 0 ),
            new THREE.Vector3( x, y, 0 )
        );
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
        // this.orbitControl.minDistrance = 0;
        // this.orbitControl.maxDistrance = 0;
        // this.orbitControl.enableZoom = false;
        // this.orbitControl.enabled = false;
        // orbitControl.maxPolarAngle = Math.PI / 2;
    }
    animate(that) {
        let n = 0;
        let animateDeg = 0.002;
        n = n + animateDeg;
        this.renderer.render(this.scene, this.camera);
        this.scene.rotation.y -= animateDeg;
        requestAnimationFrame(this.animate.bind(this));
    }
}