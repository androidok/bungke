package com.leemon.wushiwan.enums;

import com.alibaba.fastjson.serializer.JSONSerializable;
import com.alibaba.fastjson.serializer.JSONSerializer;
import com.baomidou.mybatisplus.core.enums.IEnum;

import java.io.IOException;
import java.lang.reflect.Type;

/**
 * @description: 用户的类型，是前台用户还是后台用户
 * @author: limeng
 * @create: 2019-04-02 21:46
 **/
public enum PartnerTimeType implements IEnum<Integer>, JSONSerializable {
	NONE,
	MONTH,//月卡
	YEAH;//年卡

	@Override
	public Integer getValue() {
		return ordinal();
	}

	@Override
	public void write(JSONSerializer serializer, Object fieldName, Type fieldType, int features) throws IOException {
		serializer.write(getValue());
	}
}
