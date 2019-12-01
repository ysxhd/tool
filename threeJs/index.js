class Disk3D {
    constructor(data, number) {
      this.data = data;
      this.number = number; // 最外层一共有多少数据
      this.middleRadius = 24; // 实线最大圆半径
      this.width = 0;  // 场景宽
      this.height = 0; // 场景高
      this.renderer = null; // 渲染器
      this.scene = null; // 场景
      this.sceneScale = {x: 1, y: 1, z: 1};  // 场景缩放比例
      this.cameraY = 0; // 相机的y轴位置
      this.cameraZ = 230; // 相机的y轴位置
      this.camera = null;
      this.centerSphere = null; // 底部正中间小球
      this.centerPoint = { x: 0, y: -330, z: 0 }; // 底部正中间小球中心点
      this.colors = [ 0xC6974A, 0xBC5A5F, 0x4CA96F ]; 
      this.hasPosData = []; // 最外层小球的位置
      this.lineGroup = new THREE.Object3D(); // 线段组合
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
        this.drawRenderer();
        this.animate();
        this.orbitControl();

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
            this.width / 2, this.height / 2, this.height / - 2, 1, 1000);
        this.camera.position.x = 0;
        this.camera.position.y = this.cameraY; // 180
        this.camera.position.z = this.cameraZ; // 400
        // 坐标轴调试用的
        let axes = new THREE.AxisHelper(280);
        this.scene.add(axes);
    }
    /**
     * 绘制光
     */
    drawLight(){
        // 绘制聚光灯光
        let spotLight = new THREE.SpotLight( '#ffffff', 0.5);
        spotLight.position.set( 0, -100, 100 );
        spotLight.shadow.camera.near = 500;
        spotLight.shadow.camera.far = 4000;
        spotLight.shadow.camera.fov = 30;
        // spotLight.castShadow = true;
        this.scene.add( spotLight );
    }
    /**
     * @desc 绘制中心点小球
     */
    drawCenter() {
        // 设置球体的值
        let radius = 5, segemnt = 16, rings = 16;
        let sphereGeometry = new THREE.SphereGeometry(radius, segemnt, rings);
        let sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x880000 });
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
        let radius = 200;
        let segments = 620; //<-- Increase or decrease for more resolution I guess
        let circleGeometryLine = new THREE.CircleGeometry( radius, segments );    
        // Remove center vertex
        circleGeometryLine.vertices.shift();
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
            // if(list[i].joinState === '已接入'){
            //     lineAnimateArr.push(lineAnimate(curve));
            // }else{
            //     lineAnimateArr.push('');
            // }
            
            this.lineGroup.add(line);
        }
        this.scene.add(this.lineGroup);
    }
    /**
     * 根据角度以及半径 ，求出当前点xy的坐标
     * @param {*} angle 角度
     * 
     */
    italicLineGenerate(angle){
            let x = +(Math.cos(angle * (Math.PI / 180)) * 200).toFixed(2);
            let y = +(Math.sin(angle * (Math.PI / 180)) * 200).toFixed(2);
            return {x, y, z: 0};
    }
    /**
     * 初始化renderer
     */
    drawRenderer() {// WebGLRenderer CanvasRenderer
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        console.log(this.renderer, '--');
        this.renderer.setClearColor(0x08172D);
        this.renderer.setSize(this.width, this.height);
        document.body.appendChild(this.renderer.domElement);
        this.renderer.render(this.scene, this.camera);
        
    }
        /**
     * @desc 绘制实线圆形
     */
    orbitControl() {
        // console.log(this.renderer);
        
        // 盘旋控制
        // let orbitControl = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        // orbitControl.minDistrance = 0;
        // orbitControl.maxDistrance = 0;
        // orbitControl.enableZoom = false;
        // orbitControl.enabled = false;
        // orbitControl.maxPolarAngle = Math.PI / 2;
    }
    animate(that) {
        let n = 0;
        let animateDeg = 0.01;
        n = n + animateDeg;
        this.renderer.render(this.scene, this.camera);
        this.scene.rotation.y -= animateDeg;
        requestAnimationFrame(this.animate.bind(this));
    }
}