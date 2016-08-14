package com.opopz.mgmt.data.controller;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.opopz.mgmt.data.domain.CoChat;
import com.opopz.mgmt.data.service.CoBlockJpaRepository;
import com.opopz.mgmt.data.service.CoChatJpaRepository;
import com.opopz.mgmt.data.service.CoUserJpaRepository;

/**
 * @author gemzone
 *
 */
@Controller
public class MainController 
{
	@Autowired 
	CoChatJpaRepository coChatJpaRepository;
	
	@Autowired 
	CoUserJpaRepository coUserJpaRepository;
	

	@Autowired
	CoBlockJpaRepository coBlockJpaRepository;
	
	
	@RequestMapping(path = "/main")
	public String main(Model model, HttpSession session)
	{
		model.addAttribute("chatList", chatList(1, 10));
		model.addAttribute("uniqueUserCount", uniqueUserCount());
		model.addAttribute("totalBlockCount", coBlockJpaRepository.limitCount() );
		return "main";
	}
	
	@RequestMapping(path = "/world")
	public String world(Model model, HttpSession session)
	{
		model.addAttribute("chatList", chatList(1, 10));
		model.addAttribute("uniqueUserCount", uniqueUserCount());
		model.addAttribute("totalBlockCount", coBlockJpaRepository.limitCount() );
		
		return "world";
	}
	
	@RequestMapping(path = "/user")
	public String user(Model model, HttpSession session)
	{
		model.addAttribute("chatList", chatList(1, 10));
		model.addAttribute("uniqueUserCount", uniqueUserCount());
		model.addAttribute("totalBlockCount", coBlockJpaRepository.limitCount() );
		
		return "user";
	}
	
	@RequestMapping(path = "/block")
	public String block(Model model, HttpSession session)
	{
		model.addAttribute("chatList", chatList(1, 10));
		model.addAttribute("uniqueUserCount", uniqueUserCount());
		model.addAttribute("totalBlockCount", coBlockJpaRepository.limitCount() );
		
		return "block";
	}
	
	@RequestMapping(path = "/sign")
	public String sign(Model model, HttpSession session)
	{
		model.addAttribute("chatList", chatList(1, 10));
		model.addAttribute("uniqueUserCount", uniqueUserCount());
		model.addAttribute("totalBlockCount", coBlockJpaRepository.limitCount() );
		
		return "sign";
	}
	
	@RequestMapping(path = "/container")
	public String container(Model model, HttpSession session)
	{
		model.addAttribute("chatList", chatList(1, 10));
		model.addAttribute("uniqueUserCount", uniqueUserCount());
		model.addAttribute("totalBlockCount", coBlockJpaRepository.limitCount() );
		
		return "container";
	}
	
	
//	@RequestMapping(path = "/main")
//	public String main(Model model, HttpSession session)
//	{
//		return "main";
//	}
	
	

	@ResponseBody
	@RequestMapping(path = "/mainTest", produces = "application/json")
	public Page<CoChat> mainTest(Model model,
			HttpSession session)
	{
		
		return chatList(1, 10);
		
	}
	
	
	// 유저 수
	public Integer uniqueUserCount()
	{
		return coUserJpaRepository.uniqueUserCount();
	}
	
	// 채팅 리스트
	public Page<CoChat> chatList(int page, int size)
	{
		Pageable pageable = new PageRequest(page, size, new Sort(Direction.DESC, "rowid"));
		return coChatJpaRepository.findAll(pageable);
	}
	
	
}

