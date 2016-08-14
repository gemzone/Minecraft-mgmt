package com.opopz.mgmt.data.controller;

import java.util.List;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.opopz.mgmt.data.domain.CoBlock;
import com.opopz.mgmt.data.domain.CoChat;
import com.opopz.mgmt.data.domain.CoSession;
import com.opopz.mgmt.data.service.CoBlockJpaRepository;
import com.opopz.mgmt.data.service.CoChatJpaRepository;
import com.opopz.mgmt.data.service.CoSessionJpaRepository;
import com.opopz.mgmt.data.service.CoSessionService;
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
	
	
	@Autowired 
	CoSessionJpaRepository coSessionJpaRepository;
	
	
	
	
	
	@RequestMapping(path = "/main")
	public String main(Model model, HttpSession session)
	{
		model.addAttribute("chatList", chatList(1, 30));
		
		model.addAttribute("sessionList", sessionList(1, 30));
		
		model.addAttribute("uniqueUserCount", uniqueUserCount());
		model.addAttribute("totalBlockCount", coBlockJpaRepository.limitCount() );
		return "main";
	}
	
	@RequestMapping(path = "/world")
	public String world(Model model, HttpSession session)
	{
		
		
		return "world";
	}
	
	@RequestMapping(path = "/user")
	public String user(Model model, HttpSession session)
	{
		// 유저 관리기능 추가
		
		
		return "user";
	}
	
	@RequestMapping(path = "/block")
	public String block(Model model, HttpSession session, 
			@RequestParam(name="page", defaultValue = "1", required = false) int page,
			@RequestParam(name="name", defaultValue = "", required = false) String name)
	{
		// 블럭 최근꺼 조회
		// 블럭 검색
		// 유저 검색
		int count = 15;
		
		if( page <= 1 ) 
		{
			page = 1;
		}
		
		int start = page <= 1 ? 0 : page * count;
		
		int prev = (page - 1) <= 1 ? 1 : (page - 1);
		int next = page + 1;
		
		if( "".equals(name) ) 
		{
			model.addAttribute("blockList", blockListMore(start, count));
		}
		else
		{
			model.addAttribute("blockList", blockListSearchName(name, start, count));
		}
		
		model.addAttribute("blockPagePrev", prev);
		model.addAttribute("blockPageNext", next);
		model.addAttribute("blockCurrentPage", page);
		model.addAttribute("searchName", name);
		
		return "block";
	}
	
	@RequestMapping(path = "/sign")
	public String sign(Model model, HttpSession session)
	{
		
		
		//model.addAttribute("signList", attributeValue);
		
		
		return "sign";
	}
	
	@RequestMapping(path = "/container")
	public String container(Model model, HttpSession session)
	{
		
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
	
	
	// 블럭 갯수 보기
	public List<CoBlock> blockListSearchName(String name, int start, int count)
	{
		return coBlockJpaRepository.blockListSearchName(name, start, count);
	}
	
	
	// 블럭 갯수 보기
	public List<CoBlock> blockListMore(int start, int count)
	{
		return coBlockJpaRepository.listMore(start, count);
	}
	
	
	
	// 최근 활동 목록
	public Page<CoSession> sessionList(int page, int size)
	{
		Pageable pageable = new PageRequest(page, size, new Sort(Direction.DESC, "rowid"));
		return coSessionJpaRepository.findAll(pageable);
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

