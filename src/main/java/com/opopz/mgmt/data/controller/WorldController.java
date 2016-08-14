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
import org.springframework.web.bind.annotation.ResponseBody;

import com.opopz.mgmt.data.domain.CoWorld;
import com.opopz.mgmt.data.service.CoWorldJpaRepository;
import com.opopz.mgmt.data.service.CoWorldService;

/**
 * @author gemzone
 *
 */
@Controller
public class WorldController 
{
	@Autowired 
	CoWorldJpaRepository coWorldJpaRepository;
	
	@Autowired 
	CoWorldService coWorldService;
	
	@ResponseBody
	@RequestMapping(path = "/world/list/{page}/{size}", produces = "application/json")
	public Page<CoWorld> test(Model model, 
			@PathVariable("page") int page,
			@PathVariable("size") int size,
			HttpSession session)
	{
		Pageable pageable = new PageRequest(page, size, new Sort(Direction.DESC, "rowid"));
		return coWorldJpaRepository.findAll(pageable);
	}
	
	public List<CoWorld> worldMapList()
	{
		return coWorldJpaRepository.findAll();
		
//		Pageable pageable = new PageRequest(1, 30, new Sort(Direction.DESC, "rowid"));
//		return coWorldJpaRepository.findAll(pageable);
	}

	
	
//	@ResponseBody
//	@RequestMapping(path = "/world/list", produces = "application/json")
//	public List<CoWorld> test(Model model, 
//			HttpSession session)
//	{
//		return coWorldJpaRepository.findAll();
//	}
	
	
	
}

