# Cordova插件开发及使用

#### 一、Cordova插件开发
##### 1.安装plugman 
	npm install -g plugman

##### 2.创建插件
	plugman create --name CorePlugin --plugin_id cordova-plugin-n22-CorePlugin --plugin_version 1.0.0

##### 3.移植原生代码
	
	移植原生代码(插件部分及关联文件)到src下的android目录

###### 示例一 CorePlugin.java (主要用于解析hybridStr,应用反射执行具体插件功能)
	
	package org.apache.cordova.n22;

	import java.util.HashMap;
	import java.util.Map;
	import org.apache.cordova.CallbackContext;
	import org.apache.cordova.CordovaInterface;
	import org.apache.cordova.CordovaPlugin;
	import org.apache.cordova.CordovaWebView;
	import org.json.JSONArray;
	import org.json.JSONException;
	import android.annotation.SuppressLint;
	import android.app.Activity;
	import android.content.Context;
	import android.content.Intent;
	
	public class CorePlugin extends CordovaPlugin {
	
		private Activity activity;
	    private CordovaWebView webView;
	
	    public CorePlugin() {
	    }
	
	    @Override
	    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
	        super.initialize(cordova, webView);
	        this.activity = cordova.getActivity();
	        this.webView = webView;
	    }
	
	    @SuppressLint("NewApi")
		@Override
	    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
	        if ("callNative".equals(action)) {
	        	System.out.println("callNative"+action);
	        	Map<String, Object> paramMap = parseProtocol((String) args.get(0));
	        	String protocolType = (String) paramMap.get("type"),
	        			name =(String) paramMap.get("nameId"),
	        			methodAction =(String) paramMap.get("method"),
	        			parameterStr =(String) paramMap.get("parm");
	        	if(name.indexOf(":")!=-1)
	        	{
	        		name = name.substring(0,name.indexOf(":"));
	        	}
	        	System.out.println(paramMap);
	        	try {
					Object test;
					test = ReflectUtil.invokeMethod(Class.forName(activity.getPackageName()+".plugin."+name).newInstance(),methodAction, new Class<?>[] { CallbackContext.class,Context.class, String.class },
					     new Object[] { callbackContext,activity, parameterStr });
					System.out.println(test);
				} catch (InstantiationException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					callbackContext.error("调用原生反射错误");
				} catch (IllegalAccessException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					callbackContext.error("调用原生反射错误");
				} catch (ClassNotFoundException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					callbackContext.error("调用原生反射错误");
				}
	            return true;
	        }
	        return false;
	    }
	    
	    public static Map<String, Object> parseProtocol(String parmStr) {
			String protocolType = null,name = null,methodAction = null,parameterStr = null;
			String parmIn = new String(parmStr);
			if(parmIn.indexOf("hybrid://")!=-1)
			{
				protocolType = "hybrid";
				parmIn = parmIn.replace("hybrid://", "");
				name = parmIn.substring(0, parmIn.indexOf("/"));
				if(parmIn.indexOf("?")!=-1){
					methodAction = parmIn.substring(parmIn.indexOf("/")+1,parmIn.indexOf("?"));
				}else{
					methodAction = parmIn.substring(parmIn.indexOf("/")+1,parmIn.length());
				}
				
				parameterStr = parmIn.substring(parmIn.indexOf("?")+1,parmIn.length());
			}
			Map<String, Object> res = new HashMap<String, Object>();
			res.put("type", protocolType);
			res.put("nameId", name);
			res.put("method", methodAction);
			res.put("parm", parameterStr);
			
			return res;
		}
	    
	    @Override
	    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
	    	// TODO Auto-generated method stub
	    	super.onActivityResult(requestCode, resultCode, intent);
	    	System.out.println("进入返回");
	    }
	}


###### 示例二 ReflectUtil.java (为配合CorePlugin使用的反射操作类)
	
	package org.apache.cordova.n22;

	import android.annotation.SuppressLint;
	import android.util.ArrayMap;
	
	import java.lang.reflect.Constructor;
	import java.lang.reflect.Field;
	import java.lang.reflect.Method;
	import java.lang.reflect.Modifier;
	import java.lang.reflect.ParameterizedType;
	import java.lang.reflect.Type;
	import java.math.BigDecimal;
	import java.text.SimpleDateFormat;
	import java.util.ArrayList;
	import java.util.Date;
	import java.util.List;
	import java.util.Map;
	
	/**
	 * 反射工具类
	 *
	 * @author yangzhilei
	 */
	@SuppressLint("NewApi")
	public class ReflectUtil {
	
		public static final String FULL_DATE_PATTERN = "yyyy-MM-dd HH:mm:ss";
		public static final String DATE_PATTERN_MINUTE = "yyyy-MM-dd HH:mm";
		public static final String DEFAULT_DATE_PATTERN = "yyyy-MM-dd";
	
		static final String[] tryParttern = new String[] { FULL_DATE_PATTERN, DATE_PATTERN_MINUTE, DEFAULT_DATE_PATTERN };
	
		public static Object newInstance(String className, Object... params) {
			try {
				Class<?> cls = Class.forName(className);
				return newInstance(cls, params);
			} catch (Exception e) {
				System.out.println(e);
				return null;
			}
		}
	
		public static Object newInstance(Class<?> cls, Object... params) {
			Class<?>[] parameterTypes = null;
			if (params != null) {
				parameterTypes = new Class<?>[params.length];
				for (int i = 0; i < params.length; i++) {
					parameterTypes[i] = params[i].getClass();
				}
			}
			return newInstance(cls, parameterTypes, params);
		}
	
		/**
		 * 实例化对象
		 */
		public static Object newInstance(Class<?> cls, Class<?>[] parameterTypes, Object[] params) {
			Object result = null;
			try {
				Constructor<?> constructor = getConstructor(cls, parameterTypes);
				result = constructor.newInstance(params);
			} catch (Exception e) {
				System.out.println(e);
			}
			return result;
		}
	
		/**
		 * 获取Constructor
		 */
		public static Constructor<?> getConstructor(Class<?> cls, Class<?>[] parameterTypes) throws Exception {
			Constructor<?> constructor = null;
			try {
				constructor = cls.getDeclaredConstructor(parameterTypes);
			} catch (Exception e) {
				constructor = cls.getConstructor(parameterTypes);
			}
			return constructor;
		}
	
		public static Object invokeMethod(Object obj, String methodName, Object... params) {
			Class<?>[] parameterTypes = null;
			if (params != null) {
				parameterTypes = new Class<?>[params.length];
				for (int i = 0; i < params.length; i++) {
					parameterTypes[i] = params[i].getClass();
				}
			}
			return invokeMethod(obj, methodName, parameterTypes, params);
		}
	
		/**
		 * 反射调用方法
		 */
		public static Object invokeMethod(Object obj, String methodName, Class<?>[] parameterTypes, Object[] params) {
			Class<?> cls = null;
			if (obj instanceof Class<?>) {
				cls = (Class<?>) obj;
			} else {
				cls = obj.getClass();
			}
			Object result = null;
			try {
				Method method = getMethod(cls, methodName, parameterTypes);
				method.setAccessible(true);
				result = method.invoke(obj, params);
			} catch (Exception e) {
				System.out.println(e);
				System.out.println("invoke method:" + methodName + "failed");
			}
			return result;
		}
	
		/**
		 * 获取Method
		 */
		public static Method getMethod(Class<?> cls, String methodName, Class<?>[] parameterTypes) throws Exception {
			Method method = null;
			try {
				method = cls.getDeclaredMethod(methodName, parameterTypes);
			} catch (Exception e) {
				method = cls.getMethod(methodName, parameterTypes);
			}
			return method;
		}
	
		/**
		 * 获取class对应所有字段
		 */
		public static Field[] getFields(Class<?> cls) {
			Field[] result = cls.getDeclaredFields();
			if (result != null) {
				return result;
			}
			return new Field[] {};
		}
	
		/**
		 * 获取field属性值
		 */
		public static Object getFieldValue(Object target, Field field) {
			if (!field.isAccessible()) {
				field.setAccessible(true);
			}
			try {
				return field.get(target);
			} catch (Exception e) {
				System.out.println(e);
			}
			return null;
		}
	
		/**
		 * 获取field属性值
		 */
		public static Object getFieldValue(Object target, String fieldName) {
			try {
				Field field = target.getClass().getDeclaredField(fieldName);
				return getFieldValue(target, field);
			} catch (Exception e) {
				System.out.println(e);
				return null;
			}
		}
	
		/**
		 * 设置field属性值
		 */
		public static boolean setFieldValue(Object target, Field field, Object value) {
			if (!field.isAccessible()) {
				field.setAccessible(true);
			}
			try {
				Object result = null;
				if (value != null) {
					Class<?> type = field.getType();
					if (type.equals(value.getClass()) || type.isAssignableFrom(value.getClass())) {
						result = value;
					} else {
						if (String.class.equals(type)) {
							result = String.valueOf(value);
						} else if (Integer.class.equals(type) || int.class.equals(type)) {
							result = Double.valueOf(value + "").intValue();
						} else if (Double.class.equals(type) || double.class.equals(type)) {
							result = Double.valueOf(value + "");
						} else if (Float.class.equals(type) || float.class.equals(type)) {
							result = Double.valueOf(value + "").floatValue();
						} else if (Long.class.equals(type) || long.class.equals(type)) {
							result = Double.valueOf(value + "").longValue();
						} else if (Date.class.equals(type)) {
							result = getDate(value + "");
						} else if (BigDecimal.class.equals(type)) {
							result = new BigDecimal(value + "");
						}
					}
				}
				field.set(target, result);
				return true;
			} catch (Exception e) {
				System.out.println(e);
				return false;
			}
		}
	
		/**
		 * String转Date，尝试tryParttern中的各种格式
		 */
		public static Date getDate(String dateStr) {
			Date date = null;
			SimpleDateFormat sf = new SimpleDateFormat();
			for (int i = 0; i < tryParttern.length; i++) {
				sf.applyPattern(tryParttern[i]);
				try {
					date = sf.parse(dateStr);
				} catch (Exception e) {
	
				}
				if (date != null) {
					return date;
				}
			}
			if (date == null) {
				System.out.println("trans date failed, dateStr : " + dateStr);
			}
			return date;
		}
	
		/**
		 * map 映射到 Object，对象必须有默认无参构造,对象中不支持map字段
		 *
		 * @return
		 */
		@SuppressWarnings("unchecked")
		public static <T> T mapToObject(Class<T> cls, Map<?, ?> map) {
			T obj = (T) ReflectUtil.newInstance(cls);
			if (obj != null) {
				Field[] fields = getFields(cls);
				for (Field f : fields) {
					if (isSkip(f)) {
						continue;
					}
					f.setAccessible(true);
					String name = f.getName();
					Object value = map.get(name);
					if (value != null) {
						if (isBaseType(f)) {// 基础类型
							setFieldValue(obj, f, value);
						} else if (f.getType().isAssignableFrom(value.getClass())) {// value与字段类型一致
							// List集合,必须有泛型
							if (List.class.isAssignableFrom(f.getType())) {
								List<Object> list = (List<Object>) value;
								transMapListToObjList(list, f);
							}
							setFieldValue(obj, f, value);
						} else if (Map.class.isAssignableFrom(value.getClass())) {// value为map类型，需要进行映射
							setFieldValue(obj, f, mapToObject(f.getType(), (Map<?, ?>) value));
						}
					}
				}
			}
			return obj;
		}
	
		static void transMapListToObjList(List<Object> list, Field f) {
			Type fc = f.getGenericType();
			if (fc == null) {
				return;
			}
			Class<?> parameterizedType = getParameterizedType(fc);
			if (parameterizedType != null) {
				for (int i = 0; i < list.size(); i++) {
					Object obj = list.get(i);
					if (parameterizedType.isAssignableFrom(obj.getClass())) {
						continue;
					} else if (Map.class.isAssignableFrom(obj.getClass())) {
						list.set(i, mapToObject(parameterizedType, (Map<?, ?>) obj));
					}
				}
			}
		}
	
		public static Class<?> getParameterizedType(Type type) {
			if (type instanceof ParameterizedType) {
				try {
					Class<?> pType = (Class<?>) ((ParameterizedType) type).getActualTypeArguments()[0];
					return pType;
				} catch (Exception e) {
					System.out.println(e);
				}
			}
			return null;
		}
	
		static boolean isSkip(Field f) {
			int modifiers = f.getModifiers();
			// 过滤final static transient修饰的字段
			if (Modifier.isFinal(modifiers) || Modifier.isStatic(modifiers) || Modifier.isTransient(modifiers)) {
				return true;
			}
			return false;
		}
	
		static boolean isBaseType(Field f) {
			Class<?> type = f.getType();
			if (type.isPrimitive()) {
				return true;
			}
			if (type.getName().startsWith("java.lang") || Date.class.equals(type) || BigDecimal.class.equals(type) || byte[].class.equals(type)
					|| int[].class.equals(type) || int[].class.equals(type) || double[].class.equals(type)) {
				return true;
			}
			return false;
		}
	
		/**
		 * Object 转 Map,支持对象嵌套，对象中不支持Map类型
		 */
		@SuppressLint("NewApi")
		@SuppressWarnings("unchecked")
		public static Map<String, Object> objectToMap(Object obj) {
			ArrayMap<String, Object> map = new ArrayMap<String, Object>();
			Field[] fields = getFields(obj.getClass());
			for (Field f : fields) {
				if (isSkip(f)) {
					continue;
				}
				f.setAccessible(true);
				Object value = getFieldValue(obj, f);
				if (value != null) {
					if (isBaseType(f)) {
						map.put(f.getName(), value);
					} else if (List.class.isAssignableFrom(f.getType())) {// List类型
						List<Map<String, Object>> result = transListToMapList((List<Object>) value, f);
						if (result != null && !result.isEmpty()) {
							map.put(f.getName(), result);
						}
					} else {
						map.put(f.getName(), objectToMap(value));
					}
				}
			}
			return map;
		}
	
		static List<Map<String, Object>> transListToMapList(List<Object> list, Field f) {
			List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
			Type fc = f.getGenericType();
			if (fc == null) {
				return null;
			}
			Class<?> parameterizedType = getParameterizedType(fc);
			if (parameterizedType != null) {
				for (int i = 0; i < list.size(); i++) {
					Object obj = list.get(i);
					if (parameterizedType.isAssignableFrom(obj.getClass())) {
						result.add(objectToMap(obj));
					}
				}
			}
			return result;
		}
	}

###### 示例四 MADiallPhone.java (通过解析hybridStr并在CorePlugin使用反射技术来执行的插件示例)
	注意:此文件应位于工程项目包名下的plugin目录中

	package cn.com.n22.prd.plugin;

	import android.content.Context;
	import android.content.Intent;
	import android.net.Uri;
	import android.text.TextUtils;
	
	import org.apache.cordova.CallbackContext;
	import org.json.JSONException;
	import org.json.JSONObject;
	
	import cn.com.n22.prd.MainActivity;
	import cn.com.n22.prd.uiInterface.MAInterface;
	
	/**
	 * Created by zhanxiaolin-n22 on 2018/1/17.
	 */
	
	public class MADiallPhone implements MAInterface {
	
	    private MainActivity activity;
	    private CallbackContext mCallbackContext;
	
	    /**
	     * h5与原生的回调方法
	     * @param callbackContext  回调
	     * @param context activity
	     * @param args h5页面可传参 需配置
	     */
	    private void invokeDiallPhone(final CallbackContext callbackContext, final Context context, String args) {
	        activity = (MainActivity) context;
	        mCallbackContext = callbackContext;
	        if(!TextUtils.isEmpty(args)){
	            JSONObject json = null;
	            try {
	                json = new JSONObject(args);
	                diallPhone(json.getString("url"));
	            } catch (JSONException e) {
	                callbackContext.error(e.getMessage());
	            }
	        }
	    }
	
	    @Override
	    public void onAfterApplyAllPermission(int requestCode) {
	
	    }
	
	    @Override
	    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
	
	    }
	
	    /**
	     * 拨打电话（跳转到拨号界面，用户手动点击拨打）
	     *
	     * @param phoneNum 电话号码
	     */
	    public void diallPhone(String phoneNum) {
	        Intent intent = new Intent(Intent.ACTION_DIAL);
	        Uri data = Uri.parse("tel:" + phoneNum);
	        intent.setData(data);
	        activity.startActivity(intent);
	    }
	}

	关联类一:
	package cn.com.n22.prd.uiInterface;

	import android.content.Intent;
	
	/**
	 * 作者：wwl on 2017/8/2 16：40.
	 * 邮箱：wwl198800@163.com
	 * 电话：18600868377
	 */
	
	public interface ActivityResultBackInterface {
	
	  /**
	   * 处理onActivityResult回调
	   */
	  void onActivityResult(int requestCode, int resultCode, Intent intent);
	
	}
	
	关联类二:
	package cn.com.n22.prd.uiInterface;

	/**
	 * 作者：wwl on 2017/8/2 16：37.
	 * 邮箱：wwl198800@163.com
	 * 电话：18600868377
	 */
	
	public interface PermissionInterface {
	
	  /**
	   * 申请所有权限之后的逻辑
	   */
	  void onAfterApplyAllPermission(int requestCode);
	
	}

	关联类三:
	package cn.com.n22.prd.uiInterface;

	/**
	 * 作者：wwl on 2017/7/25 17：28.
	 * 邮箱：wwl198800@163.com
	 * 电话：18600868377
	 */
	public interface MAInterface extends PermissionInterface, ActivityResultBackInterface {
	
	}



	
##### 4.交互部分编写(www/xxxjs)
	/* 此交互js可公共使用
	 * hybridStr 调用原生事例
	 * MABjCaPlugin 为 业务类 类名
	 * 202 方法ID
	 * showSignMutiViewWithInfo 为方法名
	 * ?问号后面为方法参数 
	 * var hybridStr = 'hybrid://MABjCaPlugin:202/showSignMutiViewWithInfo?{\"paramters\":\"hello\"}';
	 * CorePlugin.hybridCallAction(hybridStr, successBlock, failBlock);
	 * //调用插件 成功返回
	 * function successBlock(result){
	 * 	console.log(result);
	 * }
	 * //调用插件 失败返回
	 * function failBlock(errorStr){
	 *	console.log(errorStr);
	 * }
	 */
	var exec = require('cordova/exec');
	
	var CorePlugin = {
	    hybridCallAction:function(hybridStr,successBlock,failBlock) {
	        exec(successBlock, failBlock, "CorePlugin", "callNative", [hybridStr]);
	    }
	};
	module.exports = CorePlugin;

##### 5.配置文件修改(plugin.xml)
	
	<?xml version='1.0' encoding='utf-8'?>
	<plugin 
			id="cordova-plugin-n22-CorePlugin" 
			version="1.0.0" 
			xmlns="http://apache.org/cordova/ns/plugins/1.0" xmlns:android="http://schemas.android.com/apk/res/android">
		<!--插件名称-->	    
		<name>CorePlugin</name>
		<!--插件描述-->	
	    <description>A cordova plugin, a JS version of n22 SDK</description>
	    <keywords>cordova,n22</keywords>
	    <js-module name="CorePlugin" src="www/CorePlugin.js">
			<!--H5或js通过它去调用js中间件（插件）中定义的方法-->
	        <clobbers target="CorePlugin" />
	    </js-module>
	    <!-- platform：支持的平台 android -->
	    <platform name="android">
			<!--插件的配置信息，build的时候会添加到res/xml/config.xml 文件中-->
	        <config-file target="res/xml/config.xml" parent="/*">
	            <feature name="CorePlugin">
	                <param name="android-package" value="org.apache.cordova.n22.CorePlugin"/>
	            </feature>
	        </config-file>
			<source-file src="src/android/CorePlugin.java" target-dir="src/org/apache/cordova/n22" />
			<source-file src="src/android/ReflectUtil.java" target-dir="src/org/apache/cordova/n22" />
	    </platform>
	</plugin>




##### 编译插件
	
	npm init

#### 二、Cordova插件安装使用

##### 1.安装插件

	插件列表: cordova plugin ls
	安装插件: cordova plugin add xxx
	卸载插件: cordova plugin rm xxx

##### 2.H5调用
	
	H5中使用:
	/* 此交互js可公共使用
	 * hybridStr 调用原生事例
	 * MADiallPhone 为 业务类 类名
	 * 202 方法ID
	 * invokeDiallPhone 为方法名
	 * ?问号后面为方法参数 
	 * var hybridStr = 'hybrid://MADiallPhone:202/invokeDiallPhone?{\"paramters\":\"hello\"}';
	 * CorePlugin.hybridCallAction(hybridStr, successBlock, failBlock);
	 * //调用插件 成功返回
	 * function successBlock(result){
	 * 	console.log(result);
	 * }
	 * //调用插件 失败返回
	 * function failBlock(errorStr){
	 *	console.log(errorStr);
	 * }
	 */
	var hybridStr = 'hybrid://MADiallPhone:202/invokeDiallPhone?{\"url\":\"15321776071\"}';
    CorePlugin.hybridCallAction(hybridStr,function(data){
    	alert(data)
    },function(error){
    	alert(error)
    })

##### 3.编译原生包

	编译项目: cordova build android (指定平台)

	

