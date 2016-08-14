package com.opopz.mgmt.data.controller;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author gemzone
 *
 */
@Controller
public class MainController 
{
	@RequestMapping(path = "/main")
	public String main(Model model, HttpSession session)
	{
		return "main";
	}
	
//	@RequestMapping(path = "/main")
//	public String main(Model model, HttpSession session)
//	{
//		return "main";
//	}
	
	
	
}

