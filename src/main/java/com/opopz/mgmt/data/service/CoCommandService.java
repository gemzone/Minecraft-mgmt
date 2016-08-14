package com.opopz.mgmt.data.service;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @author gemzone (admin@modjk.com)
 * @version 1.0
 */

@Component
public class CoCommandService
{
	@SuppressWarnings("unused")
	private static final Log log = LogFactory.getLog(CoCommandService.class);
	
	@Autowired
	CoCommandJpaRepository coCommandJpaRepository;
	
	
	
}