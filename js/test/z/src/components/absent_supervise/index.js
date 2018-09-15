// 身份缺考
export * from './identity/identity_first_component';
export * from './identity/identity_second_component';
// 现场缺考
export * from './scene/scene_first_component';
export * from './scene/scene_second_component';
// 视频缺考
export * from './camera/camera_first_component'
export * from './camera/camera_second_component';
// 成绩缺考
export * from './achievement/achievement';
// 阅卷缺考
export * from './paper/marking';
//缺考详情页  
export * from './public_detail/identity_detail';

// 验证对比
// 左边的tab 未验证且现场缺考
export * from './verification_contrast/left_tab/unverified_detail';
export * from './verification_contrast/left_tab/unverified_first_component';
export * from './verification_contrast/left_tab/unverified_second_component';

// 右边的tab 验证且现场缺考
export * from './verification_contrast/right_tab/unverifiedFrist';
export * from './verification_contrast/right_tab/unverifiedFristNext';
export * from './verification_contrast/right_tab/veriy_detail';

// 缺考综合处置 
export * from './comprehensive/comprehensive';
export * from './comprehensive/comprehensiveNext';
export * from './comprehensive/comprehensiveChild';