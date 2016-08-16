package com.nikemc.mgmt.data.controller;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.nikemc.mgmt.data.domain.CoUser;
import com.nikemc.mgmt.data.domain.CoUsernameLog;
import com.nikemc.mgmt.data.service.CoUserJpaRepository;
import com.nikemc.mgmt.data.service.CoUserService;
import com.nikemc.mgmt.data.service.CoUsernameLogJpaRepository;
import com.nikemc.mgmt.data.service.CoUsernameLogService;

/**
 * @author gemzone
 *
 */
@Controller
public class UserController 
{
	@Autowired CoUserJpaRepository coUserJpaRepository;
	@Autowired CoUserService coUserService;

	@ResponseBody
	@RequestMapping(path = "/user/list/{page}/{size}", produces = "application/json")
	public Page<CoUser> user(Model model, 
			@PathVariable("page") int page,
			@PathVariable("size") int size,
			HttpSession session)
	{
		Pageable pageable = new PageRequest(page, size, new Sort(Direction.DESC, "rowid"));
		return coUserJpaRepository.findAll(pageable);
	}
	
	
	
	@Autowired CoUsernameLogJpaRepository coUsernameLogJpaRepository;
	@Autowired CoUsernameLogService coUsernameLogService;
	

	@ResponseBody
	@RequestMapping(path = "/usernameLog/list/{page}/{size}", produces = "application/json")
	public Page<CoUsernameLog> usernameLog(Model model, 
			@PathVariable("page") int page,
			@PathVariable("size") int size,
			HttpSession session)
	{
		Pageable pageable = new PageRequest(page, size, new Sort(Direction.DESC, "rowid"));
		return coUsernameLogJpaRepository.findAll(pageable);
	}
	
	
	
}

